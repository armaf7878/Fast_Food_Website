from rest_framework import serializers
from .models import Order, OrderItem
from foods.models import Food
from voucher.models import Voucher
from accounts.models import User
from django.db import transaction

class OrderItemReadSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="food.food_name", read_only=True)
    food_img = serializers.CharField(source="food.food_img", read_only=True)
    food_price = serializers.CharField(source="food.food_price", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "orderItem_id", 
            "food", 
            "food_name", 
            "food_img", 
            "food_price",
            "quantity", 
            "price_each", 
            "sub_total"
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    food_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['orderItem_id', 'food_id', 'quantity', 'price_each', 'sub_total']
        read_only_fields = ['orderItem_id', 'price_each', 'sub_total']

    def validate(self, attrs):
        food_id = attrs.get("food_id")
        quantity = attrs.get("quantity")

        if quantity <= 0:
            raise serializers.ValidationError("Số lượng phải > 0")

        try:
            food = Food.objects.get(food_id=food_id)
        except Food.DoesNotExist:
            raise serializers.ValidationError("Food không tồn tại")
        
        if food.quantity_available < quantity:
            raise serializers.ValidationError(
                f"{food.food_name} chỉ còn {food.quantity_available} phần."
            )

        return attrs

    def create(self, validated_data):
        food_id = validated_data.pop("food_id")
        food = Food.objects.get(food_id=food_id)
        validated_data["food"] = food
        validated_data["price_each"] = food.food_price
        validated_data["sub_total"] = food.food_price * validated_data["quantity"]
        return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    order_items_read = OrderItemReadSerializer(source="order_orderItem", many=True, read_only=True)
    voucher_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'user', 'staff', 'shipper',
            'voucher_id', 'order_lat', 'order_long', 'order_address',
            'order_phone', 'order_date', 'subtotal',
            'discount_amount', 'total', 'status', 'payment_status', 'payment_method',
            'items',      
            'order_items_read'
        ]
        read_only_fields = ['order_id', 'order_date', 'subtotal', 'discount_amount', 'total']

    def validate(self, attrs):
        staff = attrs.get("staff")
        if staff and staff.role != "staff":
            raise serializers.ValidationError("Người được gán staff không phải role staff.")

        shipper = attrs.get("shipper")
        if shipper and shipper.role != "shipper":
            raise serializers.ValidationError("Người được gán shipper không phải role shipper.")

        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        voucher_id = validated_data.pop("voucher_id", None)
        payment_method = validated_data.get("payment_method")
        with transaction.atomic():   
            subtotal = 0
            order_items = []
            voucher = None

            if voucher_id:
                try:
                    voucher = Voucher.objects.get(voucher_id=voucher_id)
                except Voucher.DoesNotExist:
                    raise serializers.ValidationError("Voucher không tồn tại.")

            for item in items_data:
                food_id = item["food_id"]
                quantity = item["quantity"]

                food = Food.objects.select_for_update().get(food_id=food_id)

                if food.quantity_available < quantity:
                    raise serializers.ValidationError(
                        f"Không đủ số lượng món {food.food_name}. Còn lại: {food.quantity_available}"
                    )

                food.quantity_available -= quantity
                if food.quantity_available == 0:
                    food.is_active = False
                food.save()

                price_each = food.food_price
                sub_total_item = price_each * quantity

                subtotal += sub_total_item

                order_items.append({
                    "food": food,
                    "quantity": quantity,
                    "price_each": price_each,
                    "sub_total": sub_total_item
                })

            discount_amount = 0
            if voucher:
                if subtotal < voucher.min_order_value:
                    raise serializers.ValidationError(
                        f"Đơn tối thiểu {voucher.min_order_value} mới dùng voucher."
                    )

                if voucher.discount_type == 'percent':
                    discount_amount = subtotal * (voucher.discount_value / 100)
                    voucher.used_count += 1
                    voucher.save()
                else:
                    discount_amount = voucher.discount_value
                    voucher.used_count += 1
                    voucher.save()

                discount_amount = min(discount_amount, subtotal)

            total = subtotal - discount_amount
            
            order = Order.objects.create(
                **validated_data,
                subtotal=subtotal,
                discount_amount=discount_amount,
                total=total,
                voucher=voucher
            )

            for item in order_items:
                OrderItem.objects.create(order=order, **item)

            return order
