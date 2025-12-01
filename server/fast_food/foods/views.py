from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from rest_framework.response import Response
from .serializers import FoodSerializer
from .models import Food
import os
@api_view(['GET'])
def showall(request):
    foods = Food.objects.all().order_by('-food_id')
    serializer = FoodSerializer(foods, many = True, context = {'request': request})
    return Response({
            'message': 'Hiển thị tất cả thức ăn',
            'data': serializer.data
        }, status= status.HTTP_200_OK)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create(request):
    serializer = FoodSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Tạo món thành công',
            'food' : serializer.data
        }, status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete(request, food_id):
    try:
        food = Food.objects.get(pk = food_id)
    except Food.DoesNotExist:
            return Response({
                'message': 'Xóa thức ăn thất bại - Không tìm thấy món'
            }, status= status.HTTP_404_NOT_FOUND)
    food.delete()
    if food.food_img and os.path.isfile(food.food_img.path):
        os.remove(food.food_img.path)
    return Response({
         'message': 'Đã xóa món ăn thành công'
    }, status= status.HTTP_200_OK)
    

@api_view(['PATCH'])
def update(request, food_id):
    try:
        food = Food.objects.get(pk = food_id)
    except Food.DoesNotExist:
            return Response({
                'message': 'Cập nhật thức ăn thất bại - Không tìm thấy món'
            }, status= status.HTTP_404_NOT_FOUND)
    serializer = FoodSerializer(food, data = request.data, partial = True, context = {'request', request})
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Cập nhật món thành công'
        }, status= status.HTTP_200_OK)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
