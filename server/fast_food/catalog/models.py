from django.db import models

class Catalog(models.Model):
    catalog_id = models.AutoField(primary_key=True)
    catalog_name = models.CharField(max_length=100)
    catalog_img = models.ImageField(upload_to='catalogs/', null=True, blank=True)

    def __str__(self):
        return self.catalog_name
