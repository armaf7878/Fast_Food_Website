from django.db import models
from accounts.models import User
from foods.models import Food

class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='cart_userID' )
    def __str__(self):
        return f"{self.cart_id} ({self.user.user_id})"

class CartItem(models.Model):
    cartItem_id = models.AutoField(primary_key= True)
    food = models.ForeignKey(Food, on_delete= models.CASCADE, related_name='cartItem_foodID' )
    cart = models.ForeignKey(Cart, on_delete= models.CASCADE, related_name='cartItem_Cart')

    quantity = models.IntegerField(null = True, blank= True)
    def __str__(self):
        return f"{self.cartItem_id} ({self.food.food_id})"