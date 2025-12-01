from django.db import models
from catalog.models import Catalog

class Food(models.Model):
    food_id = models.AutoField(primary_key = True)
    catalog_id = models.ForeignKey(Catalog, on_delete = models.SET_NULL , null= True , related_name='foods')
    
    food_name = models.CharField(max_length = 100, unique= True)
    food_description = models.TextField(null= True, blank = True)
    food_price = models.DecimalField(max_digits = 10, decimal_places =2)
    food_img = models.ImageField(upload_to='foods/', null = True, blank = True)
    quantity_available = models.PositiveIntegerField(default = 0)
    is_active = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True)
    
    def __str__(self):
        return f"{self.food_name}"
