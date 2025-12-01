from django.urls import path
from . import views
urlpatterns = [
    path('showall/', views.showall, name="showallVoucher"),
    path('showallCanused/', views.showall_canUsed, name="showallVoucherCanUsed"),
    path('create/', views.create, name="createVoucher"),
    path('delete/<str:voucher_id>', views.delete, name="deleteVoucher"),
    path('update/<str:voucher_id>', views.update, name="updateVoucher"),
    path('detail/<str:voucher_id>', views.detail, name="detailVoucher"),
    path("apply/", views.apply, name="applyVoucher"),
]