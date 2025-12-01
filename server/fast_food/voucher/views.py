from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import F

from .models import Voucher
from .serializers import VoucherSerializer
from datetime import date


@api_view(['GET'])
@permission_classes([AllowAny])
def showall(request):
    vouchers = Voucher.objects.all().order_by('-created_at')
    serializer = VoucherSerializer(vouchers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def showall_canUsed(request):
    today = timezone.now().date()

    vouchers = Voucher.objects.filter(
        is_active=True,
        used_count__lt=F("max_uses"),
        start_date__lte=today,
        end_date__gte=today
    ).order_by("-created_at")

    serializer = VoucherSerializer(vouchers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def detail(request, voucher_id):
    try:
        voucher = Voucher.objects.get(voucher_id=voucher_id)
    except Voucher.DoesNotExist:
        return Response({"detail": "Voucher không tồn tại"}, status=404)

    serializer = VoucherSerializer(voucher)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create(request):
    serializer = VoucherSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Tạo voucher thành công", "data": serializer.data},
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update(request, voucher_id):
    try:
        voucher = Voucher.objects.get(voucher_id=voucher_id)
    except Voucher.DoesNotExist:
        return Response({"detail": "Voucher không tồn tại"}, status=404)

    serializer = VoucherSerializer(voucher, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Cập nhật thành công", "data": serializer.data})

    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete(request, voucher_id):
    try:
        voucher = Voucher.objects.get(voucher_id=voucher_id)
    except Voucher.DoesNotExist:
        return Response({"detail": "Voucher không tồn tại"}, status=404)

    voucher.delete()
    return Response({"message": "Xóa voucher thành công"})

@api_view(['POST'])
@permission_classes([AllowAny])
def apply(request):
    voucher_id = request.data.get("voucher_id")
    order_total = request.data.get("order_total")

    if order_total is None:
        return Response({"detail": "order_total là bắt buộc"}, status=400)

    order_total = float(order_total)

    try:
        voucher = Voucher.objects.get(voucher_id=voucher_id)
    except Voucher.DoesNotExist:
        return Response({"detail": "Voucher không tồn tại"}, status=404)

    # Kiểm tra hiệu lực
    today = date.today()

    if not voucher.is_active:
        return Response({"detail": "Voucher đã bị khóa"}, status=400)

    if today < voucher.start_date or today > voucher.end_date:
        return Response({"detail": "Voucher đã hết hạn hoặc chưa có hiệu lực"}, status=400)

    if voucher.max_uses > 0 and voucher.used_count >= voucher.max_uses:
        return Response({"detail": "Voucher đã hết lượt sử dụng"}, status=400)

    if order_total < voucher.min_order_value:
        return Response({
            "detail": f"Đơn hàng phải tối thiểu {voucher.min_order_value}đ"
        }, status=400)

    # Tính giảm giá
    if voucher.discount_type == "percent":
        discount = order_total * (voucher.discount_value / 100)
    else:
        discount = voucher.discount_value

    discount = min(discount, order_total)  # tránh giảm quá mức

    new_total = order_total - discount

    return Response({
        "voucher_id": voucher.voucher_id,
        "discount": round(discount, 2),
        "new_total": round(new_total, 2),
        "message": "Áp dụng voucher thành công"
    })
