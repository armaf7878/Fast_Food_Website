from django.urls import path
from . import views
from .utils.vnpayReturn import vnpay_return
urlpatterns = [
    path('pending/', views.pending, name='pendingOrder'),
    path('cooking/', views.cooking, name='cookingOrder'),
    path('orderlist_client/', views.orderlist_client, name='orderlistClient'),
    path('create/', views.create, name='createOrder'),
    path('assign-staff/<str:order_id>/', views.assign_staff, name='assignOrder'),
    path('ready/<str:order_id>/', views.ready, name='readyOrder'),
    path('waiting-deliver/', views.waiting_Deliver, name='waiting-deliveryOrder'),
    path('finish/<str:order_id>/', views.finish_order, name='finishOrder'),
    path('canceled/', views.canceled_order, name='cancelOrder'),
    path('payment/vnpay-return/', vnpay_return, name='returnVNPay'),
]