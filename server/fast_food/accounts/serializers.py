from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'user_id', 'full_name', 'email', 'password',
            'phone', 'gender', 'city', 'district', 'detail_address',
            'avatar', 'role'
        ]
        read_only_fields = ['user_id']

    def validate(self, attrs):
        request = self.context.get('request')
        user_role = attrs.get("role", User.Role.END_USER)
        print(user_role)
        if user_role in ['staff', 'shipper']:
            if not request.user.is_authenticated or request.user.role != "admin":
                raise serializers.ValidationError(
                    "Chỉ Admin mới được tạo tài khoản Staff/Shipper."
                )
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
