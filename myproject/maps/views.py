from django.shortcuts import render
from .models import Plant
from .serializers import PlantSerializer
from rest_framework import viewsets
# Create your views here.

class PlantViewSet(viewsets.ModelViewSet):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
