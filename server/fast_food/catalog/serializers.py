from rest_framework import serializers
from .models import Catalog

class SerializersCatalog(serializers.ModelSerializer):
     class Meta:
          model = Catalog
          fields = '__all__'