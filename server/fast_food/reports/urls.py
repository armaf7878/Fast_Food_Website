from django.urls import path
from .views import get_daily_report, generate_daily_report

urlpatterns = [
    path("daily/", get_daily_report),
    path("generate/", generate_daily_report),
]