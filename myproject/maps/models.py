from django.db import models

# Create your models here.
class Plant(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    impact = models.TextField()

    def __str__(self):
        return self.name