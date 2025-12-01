from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import OrderSerializer
from .models import Order
from accounts.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db import transaction
from django.conf import settings
from .utils.vnpay import build_vnpay_url
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create(request):
    data = request.data.copy()
    data['user'] = request.user.user_id

    serializer = OrderSerializer(data=data)

    if serializer.is_valid():
        with transaction.atomic():
            order = serializer.save()
            requested_items = data.get("items", [])
            food_ids = [item['food_id'] for item in requested_items]

            from cart.models import CartItem, Cart
            
            cart = Cart.objects.get(user_id = request.user.user_id)

            CartItem.objects.filter(
                cart_id=cart.cart_id,
                food_id__in=food_ids
            ).delete()

        client_ip = "127.0.0.1" 

        if order.payment_method == 'vnpay':

            payment_url = build_vnpay_url(
                amount=order.total,
                order_id=order.order_id,
                ip=client_ip,
                return_url=settings.VNPAY_RETURN_URL,
                tmn_code=settings.VNPAY_TMN_CODE,
                secret_key=settings.VNPAY_HASH_SECRET,
                vnp_url=settings.VNPAY_URL
            )
            return Response({
                "payment_url": payment_url,
                "message": "Tạo đơn hàng thành công",
                "order_id": order.order_id
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Tạo đơn hàng thành công",
            "order_id": order.order_id
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending(request):
    if request.user.role != "staff":
        return Response({"detail": "Bạn không phải staff"}, status=403)

    orders = Order.objects.filter(status="pending", staff__isnull=True)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cooking(request):
    if request.user.role != "staff":
        return Response({"detail": "Bạn không phải staff"}, status=403)

    orders = Order.objects.filter(status="cooking", staff_id=request.user.user_id)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_staff(request, order_id):
    print(request.user.role)
    if request.user.role != "staff":
        return Response({"detail": "Bạn không phải staff"}, status=403)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Đơn hàng không tồn tại"}, status=404)

    if order.staff is not None:
        return Response({"detail": "Đơn hàng đã có staff nhận"}, status=400)

    if order.status != "pending":
        return Response({"detail": "Chỉ đơn pending mới nhận"}, status=400)

    order.staff = request.user
    order.status = "cooking"
    order.save()

    return Response({"message": "Nhận đơn thành công!"})

def get_available_shipper():
    return User.objects.filter(role="shipper", is_online=True, is_busy=False).first()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ready(request, order_id):
    if request.user.role != "staff":
        return Response({"detail": "Bạn không phải staff"}, status=403)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Đơn hàng không tồn tại"}, status=404)

    if order.staff != request.user:
        return Response({"detail": "Không phải staff phụ trách đơn này"}, status=403)

    if order.status != "cooking":
        return Response({"detail": "Chỉ đơn cooking mới báo hoàn tất chuẩn bị"}, status=400)

    shipper = get_available_shipper()
    if not shipper:
        return Response({"detail": "Không có shipper rảnh"}, status=400)

    shipper.is_busy = True
    shipper.save()
    
    order.shipper = shipper
    order.status = "delivering"
    order.save()

    return Response({
        "message": "Đã gán shipper và chuyển đơn sang delivering",
        "shipper_id": shipper.user_id
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def waiting_Deliver(request):

    if request.user.role != "shipper":
        return Response({"detail": "Bạn không phải shipper"}, status=403)

    orders = Order.objects.filter(shipper=request.user, status="delivering")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finish_order(request, order_id):
    if request.user.role != "shipper":
        return Response({"detail": "Bạn không phải shipper"}, status=403)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Đơn hàng không tồn tại"}, status=404)

    if order.shipper != request.user:
        return Response({"detail": "Bạn không phải shipper xử lý đơn này"}, status=403)

    if order.status != "delivering":
        return Response({"detail": "Đơn chưa ở trạng thái delivering"}, status=400)

    order.status = "finish"
    order.save()

    shipper = request.user
    shipper.is_busy = False
    shipper.save()
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"order_{order_id}",
        {"type": "order_finished"}
    )

    return Response({"message": "Giao hàng thành công!"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orderlist_client(request):
    orders = Order.objects.filter(user_id=request.user.user_id)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def canceled_order(request):
    order_id = request.data.get('order_id')
    try:
        order = Order.objects.get(pk = order_id)
        if(order.status == 'pending'):
            order.status = 'canceled'
            order.save()
            return Response({"message": "Đã hủy đơn thành công"}, status = status.HTTP_201_CREATED)    
        return Response({"detail": "Đơn hàng đã được nhà hàng xác nhận không thể hủy"}, status = 400)    
    except Exception as e:
        return Response({"detail": "Hủy đơn hàng thất bại",
                         "message": e
                        }, status = status.HTTP_400_BAD_REQUEST)
    