from django.urls import path
from . import views
urlpatterns= [
    path('showall/', views.showall, name="foodShowall"),
    path('create/', views.create, name="foodCreate"),
    path('update/<str:food_id>/', views.update, name="foodUpdate"),
    path('delete/<str:food_id>/', views.delete, name="foodDelete")
]