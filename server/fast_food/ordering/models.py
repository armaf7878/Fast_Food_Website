from django.db import models
from accounts.models import User
from foods.models import Food
from voucher.models import Voucher
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Chờ duyệt',
        COOKING = 'cooking', 'Đang chuẩn bị',
        DELIVERING= 'delivering', 'Đang giao',
        FINISH = 'finish', 'Hoàn tất',
        CANCELED = 'canceled', 'Hủy đơn'

    class PaymentMethod(models.TextChoices):
        COD = 'cod', 'thanh toán cod',
        VNPAY = 'vnpay', 'thanh toán cod',

    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Chờ thanh toán',
        PAID = 'paid', 'Đã thanh toán',
        CANCELED = 'canceled', 'Hủy thanh toán'
    order_id = models.AutoField(primary_key= True)
    user = models.ForeignKey(User, on_delete= models.SET_NULL, null= True, related_name="order_user")
    staff = models.ForeignKey(User, on_delete= models.SET_NULL, null= True , related_name="order_userStaff")
    shipper = models.ForeignKey(User, on_delete= models.SET_NULL , null= True, related_name="order_userShipper")
    voucher = models.ForeignKey(Voucher, on_delete= models.SET_NULL, null= True, related_name="order_voucher") 
    order_lat = models.FloatField(null= False, default=0.0)
    order_long = models.FloatField(null= False, default=0.0)
    order_address = models.CharField(null= False, default="Lấy tại nhà hàng")
    order_phone = models.CharField(max_length=15, null= False)
    order_date = models.DateTimeField(auto_now_add = True)
    subtotal = models.DecimalField(max_digits = 12, decimal_places =2)
    discount_amount = models.DecimalField(max_digits = 12, decimal_places =2)
    total = models.DecimalField(max_digits = 12, decimal_places =2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_method = models.CharField(max_length=25, choices=PaymentMethod.choices, default=PaymentMethod.COD)
    payment_status = models.CharField(max_length=25, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    def __str__(self):
        return f"{self.order_id}"


class OrderItem(models.Model):
    orderItem_id = models.AutoField(primary_key= True)
    order = models.ForeignKey(Order, on_delete= models.CASCADE, related_name="order_orderItem")
    food = models.ForeignKey(Food, on_delete= models.CASCADE, related_name="orderItem_food")
    quantity = models.IntegerField(null= False)
    price_each = models.DecimalField(max_digits = 12, decimal_places =2)
    sub_total =  models.DecimalField(max_digits = 12, decimal_places =2)
    def __str__(self):
        return f"{self.orderItem_id}"
