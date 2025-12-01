from django.shortcuts import redirect
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ordering.models import Order
import hashlib, hmac
from urllib.parse import urlencode

@api_view(['GET'])
@permission_classes([AllowAny])
def vnpay_return(request):
    input_data = request.GET.dict()
    vnp_secure_hash = input_data.pop('vnp_SecureHash', None)
    sorted_params = sorted(input_data.items())
    query_string = urlencode(sorted_params)

    computed_hash = hmac.new(
        settings.VNPAY_HASH_SECRET.encode(),
        query_string.encode(),
        hashlib.sha512
    ).hexdigest()

    if computed_hash != vnp_secure_hash:
        return Response({
            "message": "Invalid signature",
            "status": "failed"
        }, status=400)

    vnp_response_code = input_data.get("vnp_ResponseCode")
    order_id = input_data.get("vnp_TxnRef")

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({
            "message": "Order not found",
            "status": "failed"
        }, status=404)

    # Kiểm tra thành công
    if vnp_response_code == "00":
        order.payment_status = "paid"
        order.save()

        return redirect(f"http://localhost:5173/order-tracking")

    else:
        order.payment_status = "canceled"
        order.save()

        return redirect(f"http://localhost:5173/order-tracking")
