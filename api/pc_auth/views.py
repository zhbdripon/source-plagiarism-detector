from django.contrib.auth.models import User, Group
from .serializers import UserSerializer, GroupSerializer
from rest_framework import viewsets

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer