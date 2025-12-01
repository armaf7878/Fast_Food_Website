from django.urls import path
from . import views

urlpatterns = [
    path('showall/', views.showall, name='showallCate'),
    path('create/', views.create, name='createCate'),
    path('update/<str:cate_id>/', views.update, name='updateCate'),
    path('delete/<str:cate_id>/', views.delete, name='deleteCate'),

]