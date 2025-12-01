import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone

class OrderTrackingConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.order_id = self.scope["url_route"]["kwargs"]["order_id"]
        self.group_name = f"order_{self.order_id}"

 
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)


    @database_sync_to_async
    def get_order(self, order_id):
        from ordering.models import Order     
        try:
            return Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return None
        
    @database_sync_to_async
    def get_order_shipper_id(self, order):

        if order.shipper:
            return order.shipper.user_id
        return None   
    
    async def receive(self, text_data):

        order = await self.get_order(self.order_id)
        shipper_id = await self.get_order_shipper_id(order)
        if shipper_id != self.scope["user"].user_id:
            return  

        data = json.loads(text_data)
        lat = data.get("lat")
        lng = data.get("lng")

        if lat is None or lng is None:
            return

        user = self.scope["user"] 

        await self.save_location(user, self.order_id, lat, lng)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "location_update",
                "lat": lat,
                "lng": lng,
                "timestamp": timezone.now().isoformat()
            }
        )

    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            "lat": event["lat"],
            "lng": event["lng"],
            "timestamp": event["timestamp"]
        }))

    async def order_finished(self, event):
        await self.send(text_data=json.dumps({"finished": True}))
        await self.close()


    @database_sync_to_async
    def save_location(self, user, order_id, lat, lng):
        from .models import ShipperLocation
        from ordering.models import Order
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return
        if user.is_authenticated and user.role == "shipper":
            if order.shipper and order.shipper.user_id != user.user_id:
                return
            shipper = user
        else:
            # Dev/test: nếu chưa xử lý auth, cứ lấy shipper từ order
            shipper = order.shipper

        obj, created = ShipperLocation.objects.update_or_create(
            shipper=shipper,
            order=order,
            defaults={"latitude": lat, "longitude": lng}
        )
        return obj
