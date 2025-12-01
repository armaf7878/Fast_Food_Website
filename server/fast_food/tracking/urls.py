from django.urls import path
from .views import get_last_location

urlpatterns = [
    path('orders/<int:order_id>/last-location/', get_last_location),
]
