from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from .serializers import SerializersCatalog
from .models import Catalog


@api_view(['GET'])
def showall(request):
    catalogs = Catalog.objects.all().order_by('-catalog_id')
    serializer = SerializersCatalog(catalogs, many=True, context={'request': request})
    return Response({
        'message': 'Tất cả danh mục',
        'data': serializer.data
    }, status= status.HTTP_200_OK)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create(request):
    serializer = SerializersCatalog(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response({
          'message': 'Tạo danh mục mới thành công',
          'data' : serializer.data
      }, status= status.HTTP_200_OK)  
    return Response(serializer.errors , status= status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def update(request, cate_id):
    try:
      catalog = Catalog.objects.get(pk = cate_id)
    except:
       return Response({'error': 'Không tìm thấy danh mục'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SerializersCatalog(catalog, data = request.data, partial = True, context={'request': request})
    if serializer.is_valid():
       serializer.save()
       return Response({
          'message': 'Cập nhật danh mục thành công',
          'data': serializer.data
       }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete(request, cate_id):
    try:
       catalog = Catalog.objects.get(pk=cate_id)
    except Catalog.DoesNotExist:
       return Response({'error': 'Không tìm thấy danh mục'}, status=status.HTTP_404_NOT_FOUND)
    catalog.delete()
    return Response({
        'message': 'Đã xóa thành công cate có ID {cate_id}'
    }, status= status.HTTP_200_OK)