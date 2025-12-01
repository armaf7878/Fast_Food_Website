from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count
from datetime import datetime
from ordering.models import Order
from .models import Report
from .serializers import ReportSerializer
from rest_framework import status
@api_view(["GET"])
def get_daily_report(request):
    date_str = request.GET.get("date")

    if not date_str:
        return Response({"error": "Missing date parameter YYYY-MM-DD"}, status=400)

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format"}, status=400)

    orders = Order.objects.filter(
        order_date__date=target_date,
        status="finish"
    )

    total_revenue = orders.aggregate(Sum("total"))["total__sum"] or 0
    total_orders = orders.count()

    data = {
        "date": target_date,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
    }

    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_daily_report(request):
    if request.user.role != "staff":
        return Response({"detail": "Bạn không phải staff"}, status=403)
    date_str = request.GET.get("date")

    if not date_str:
        return Response({"error": "Missing date parameter"}, status=400)

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception as e:
        return Response({
            'message': 'Ngày không hợp lệ'
        }, status= status.HTTP_400_BAD_REQUEST)

    if Report.objects.filter(report_date=target_date).exists():
        return Response({
            "message": f"Báo cáo ngày {target_date} đã tồn tại"
        }, status=400)
    
    orders = Order.objects.filter(
        order_date__date=target_date,
        status="finish"
    )

    total_revenue = orders.aggregate(Sum("total"))["total__sum"] or 0
    total_orders = orders.count()

    report, created = Report.objects.update_or_create(
        report_date=target_date,
        defaults={
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "report_date": target_date
        }
    )

    return Response({
        "message": "Report generated",
        "report": ReportSerializer(report).data
    })