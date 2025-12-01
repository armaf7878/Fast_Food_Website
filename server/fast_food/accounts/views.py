from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

@api_view(['POST'])
@authentication_classes([]) 
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "Tạo tài khoản thành công", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({"detail": "Email hoặc mật khẩu không đúng"}, status=400)
    print(str(user))
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Đăng nhập thành công",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def shipper_online(request):
    user = request.user

    if user.role != "shipper":
        return Response({"detail": "Bạn không phải shipper"}, status=403)

    user.is_online = True
    user.is_busy = False
    user.save()

    return Response({"message": "Shipper đang online"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def shipper_offline(request):
    user = request.user

    if user.role != "shipper":
        return Response({"detail": "Bạn không phải shipper"}, status=403)

    if user.is_busy:
        return Response(
            {"detail": "Không thể offline khi đang giao đơn"}, 
            status=400
        )  
    user.is_online = False
    user.save()

    return Response({"message": "Shipper offline"})