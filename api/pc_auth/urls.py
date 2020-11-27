from django.urls import path, include
from .views import UserViewSet, GroupViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'group', GroupViewSet)

urlpatterns = [
]
