from django.urls import path
from . import views


urlpatterns = [

    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('online/', views.shipper_online, name='onlineShipper'),
    path('offline/', views.shipper_offline, name='offlineShipper'),
]