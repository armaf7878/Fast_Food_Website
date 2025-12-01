from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Voucher(models.Model):

    class DiscountType(models.TextChoices):
        PERCENT = 'percent', 'Giảm theo phần trăm'
        AMOUNT = 'amount', 'Giảm theo số tiền'

    voucher_id = models.AutoField(primary_key=True)
    voucher_name = models.CharField(max_length=255)
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_uses = models.IntegerField(default=0)
    used_count = models.IntegerField(default=0)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    start_date = models.DateField()
    end_date = models.DateField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    # Optional: chống lỗi ngày hết hạn < ngày bắt đầu
    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.")

    def __str__(self):
        return f"Voucher {self.voucher_id} - {self.discount_type}"

    @property
    def is_expired(self):
        """Kiểm tra hết hạn."""
        today = timezone.now().date()
        return today > self.end_date

    @property
    def is_available(self):
        """Kiểm tra còn lượt sử dụng và chưa hết hạn."""
        if not self.is_active:
            return False
        if self.max_uses > 0 and self.used_count >= self.max_uses:
            return False
        if self.is_expired:
            return False
        return True
