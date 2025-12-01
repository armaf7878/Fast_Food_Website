from django.urls import path
from . import views
urlpatterns = [
    path('showall/', views.showall, name='cartShowall'),
    path('create/<str:food_id>/', views.create, name='createCartItem'),
    path('update/<str:cartItem_id>/', views.update, name='updateCartItem'),
    path('delete/<str:cartItem_id>/', views.delete, name='deleteCartItem'),
]