from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import ShipperLocation


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_last_location(request, order_id):
    try:
        loc = ShipperLocation.objects.filter(order_id=order_id).latest("updated_at")
    except ShipperLocation.DoesNotExist:
        return Response({"detail": "Chưa có vị trí nào"}, status=404)

    return Response({
        "order_id": order_id,
        "shipper_id": loc.shipper.user_id,
        "lat": loc.latitude,
        "lng": loc.longitude,
        "updated_at": loc.updated_at
    })
