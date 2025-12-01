from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from .models import Cart, CartItem
from .serializer import CartSerializer, CartItemSerializer
from accounts.models import User



def checkCartExist(user_id):
    try:
        cart = Cart.objects.get(user_id=user_id)
        return cart.cart_id
    except Cart.DoesNotExist:
        try:
            cart = Cart.objects.create(user_id=user_id)
        except Exception as e:
            return Response({
                'message': 'Lỗi tạo giỏ hàng',
                'error': e
            }, status = status.HTTP_400_BAD_REQUEST)
        return cart.cart_id


@api_view(['GET'])
def showall(request):
    try:
        cart = Cart.objects.get(user_id=request.user.user_id)
        
    except Cart.DoesNotExist:
        try:
            cart = Cart.objects.create(user_id=request.user.user_id)
        except Exception as e:
            return Response({
                'message': 'Lỗi tạo giỏ hàng',
                'error': e
            }, status = status.HTTP_400_BAD_REQUEST)
    cartItem = CartItem.objects.filter(cart_id = cart.cart_id)

    print(str(cartItem))
    if not cartItem:
        return Response({
            'message': 'Giỏ hàng đang trống'
        }, status=status.HTTP_200_OK)    
    
    cartItemSerializer = CartItemSerializer(cartItem, many = True)
    return Response(cartItemSerializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create(request, food_id):
    cart_id = checkCartExist(request.user.user_id)
    try:
        cartItem = CartItem.objects.filter(cart_id = cart_id, food_id = food_id).first()
        if cartItem:
            request.data['quantity'] = cartItem.quantity + 1
            serialierItem = CartItemSerializer(cartItem, data = request.data, partial = True, context = {'request', request} )
            if serialierItem.is_valid():
                serialierItem.save()
                return Response({
                    'message': 'Đã cập nhật số lượng cart item thành công',
                    'data': serialierItem.data
                }, status= status.HTTP_200_OK)
            return Response({
            'message': 'Cập nhật số lượng cart item thất bại',
            'data': serialierItem.data
        }, status= status.HTTP_404_NOT_FOUND)
        print(request.data.get('quantity'))
        if(request.data.get('quantity') != None):
            cartItem = CartItem.objects.create(food_id=food_id, cart_id = cart_id, quantity = request.data['quantity'])
            serializerItem = CartItemSerializer(cartItem)
            return Response({
                'message': 'Thêm món vào cart item thành công',
                'data': serializerItem.data
            }, status= status.HTTP_200_OK)

        cartItem = CartItem.objects.create(food_id=food_id, cart_id = cart_id, quantity = 1)
    except Exception as e:
        print(str(e))
        return Response({
            'message': 'Lỗi thêm món vào cart item'
        }, status= status.HTTP_400_BAD_REQUEST)
    serializerItem = CartItemSerializer(cartItem)
    return Response({
            'message': 'Thêm món vào cart item thành công',
            'data': serializerItem.data
        }, status= status.HTTP_200_OK)


@api_view(['PATCH'])

def update(request, cartItem_id):
    print("come here 1")
    try:
        print("come here 2")
        cartItem = CartItem.objects.get(cartItem_id = cartItem_id)
        print("come here 3")
    except CartItem.DoesNotExist:
        return Response({
            'message': 'Món không tồn tại trong giỏ hàng'
        }, status= status.HTTP_400_BAD_REQUEST)
    
    serialierItem = CartItemSerializer(cartItem, data = request.data, partial = True, context = {'request', request} )
    if serialierItem.is_valid():
        serialierItem.save()
        return Response({
            'message': 'Đã cập nhật số lượng cart item thành công',
            'data': serialierItem.data
        }, status= status.HTTP_200_OK)
    return Response({
            'message': 'Cập nhật số lượng cart item thất bại',
            'data': serialierItem.data
        }, status= status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete(request, cartItem_id):
    try:
        cartItem = CartItem.objects.get(cartItem_id = cartItem_id)
    except CartItem.DoesNotExist:
        return Response({
            'message': 'Sản phẩm không tồn tại trong giỏ hàng'
        }, status= status.HTTP_400_BAD_REQUEST)
    cartItem.delete()
    return Response({
        'message': 'Đã xóa sản phẩm trong giỏ hàng'
    }, status= status.HTTP_200_OK)
    