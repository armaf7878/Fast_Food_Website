from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password= None, **extra_field):
        if not email:
            raise ValueError("Email là bắt buộc")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_field)
        user.set_password(password)
        user.save(using= self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_field):
        extra_field.setdefault('role', 'admin')
        extra_field.setdefault('is_superuser', True)
        extra_field.setdefault('is_staff', True)
        return self.create_user(email, password, **extra_field)



class User(AbstractBaseUser, PermissionsMixin):
    class Gender(models.TextChoices):
        MALE = 'male', 'Nam',
        FEMALE = 'female', 'Nu',
    
    class Role(models.TextChoices):
        END_USER = 'end_user', 'Khách hàng',
        STAFF = 'staff', 'Nhân viên',
        SHIPPER= 'shipper', 'Giao hàng',
        ADMIN = 'ADMIN', 'Quản lý'

    user_id = models.AutoField(primary_key= True)
    full_name = models.CharField(max_length= 100)
    email = models.EmailField(unique= True)
    password = models.CharField(max_length= 255)
    phone = models.CharField(max_length= 15, null= True, blank= True)
    gender = models.CharField(max_length= 10, choices=Gender.choices, null= True, blank = True)
    city = models.CharField(max_length=100, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    detail_address = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.END_USER)
    is_active = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    is_busy = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    def __str__(self):
        return self.full_name