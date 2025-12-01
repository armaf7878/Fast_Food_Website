from django.db import models
from accounts.models import User
from ordering.models import Order

class ShipperLocation(models.Model):
    shipper = models.ForeignKey(User, on_delete=models.CASCADE, related_name="locations")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="locations")
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Shipper {self.shipper.full_name} - Order {self.order.order_id}"
