from django.urls import path, include
from .views import UserViewSet, GroupViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'group', GroupViewSet)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
    path('api-auth/', include('rest_framework.urls')),
]
