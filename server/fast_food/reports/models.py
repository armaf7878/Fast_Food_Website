from django.db import models

class Report(models.Model):
    report_id = models.AutoField(primary_key= True)
    total_orders = models.PositiveIntegerField(default = 0)
    total_revenue = models.DecimalField(max_digits=14, decimal_places=2)
    report_date = models.DateField(null= False)

    def __str__(self):
        return f"Report {self.report_date}"
