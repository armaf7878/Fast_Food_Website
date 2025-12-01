from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ordering.models import Order
from .models import Feedback
from .serializers import FeedbackSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create(request):
    user = request.user
    order_id = request.data.get("order_id")

    if not order_id:
        return Response({"error": "order_id is required"}, status=400)


    try:
        order = Order.objects.get(order_id=order_id, user=user)
    except Order.DoesNotExist:
        return Response({"error": "Không tìm thấy order hoặc bạn không phải người đặt đơn"}, status=404)

 
    if order.status != "finish":
        return Response(
            {"error": "Chỉ có thể đánh giá sau khi đơn hoàn tất"},
            status=400
        )

    if Feedback.objects.filter(order=order).exists():
        return Response(
            {"error": "Bạn đã đánh giá đơn hàng này rồi"},
            status=400
        )

    data = request.data.copy()
    del data["order_id"]
    data["order"] = order_id

    print(data)
    serializer = FeedbackSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
