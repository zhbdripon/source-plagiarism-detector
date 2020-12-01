from django.urls import path, include
from rest_framework.authtoken import views
from .views import UserViewSet, GroupViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'group', GroupViewSet)

urlpatterns = [
    path('login', views.obtain_auth_token),
]
