from rest_framework import serializers
from .models import Voucher
from django.utils import timezone


class VoucherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voucher
        fields = "__all__"
        read_only_fields = ['voucher_id', 'created_at', 'used_count']

    def validate(self, attrs):
        voucher_name = attrs.get("voucher_name")
        discount_type = attrs.get("discount_type")
        discount_value = attrs.get("discount_value")
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")
        min_val = attrs.get("min_order_value")
        if voucher_name == "":
            raise serializers.ValidationError("Phải có tên cho voucher")
        if discount_type == "percent" and not (0 < discount_value <= 100):
            raise serializers.ValidationError("Giảm phần trăm phải từ 1 đến 100.")

        if discount_type == "amount" and discount_value <= 0:
            raise serializers.ValidationError("Giảm tiền phải > 0.")

        if min_val is not None and min_val < 0:
            raise serializers.ValidationError("Giá trị đơn tối thiểu phải >= 0.")

        if end_date < start_date:
            raise serializers.ValidationError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.")

        return attrs
