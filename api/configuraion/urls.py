"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from utils.routers import DefaultRouterWithSimpleViews
from rest_framework.routers import SimpleRouter

from pc_auth.views import UserViewSet, GroupViewSet
from plagiarism.views import PlagiarismApiListView


AUTH_URLS = include('pc_auth.urls')
PLAGIARISM_URLS = include('plagiarism.urls')

urlpatterns = [
    path('api/auth/',AUTH_URLS),
    path('api/plagiarism-app/',PLAGIARISM_URLS),
    path('api/admin/', admin.site.urls),
    path('api/api-auth/', include('rest_framework.urls')),
]

root_router = DefaultRouterWithSimpleViews()
root_router.register('api/user', UserViewSet)
root_router.register('api/group', GroupViewSet)
root_router.register('api/plagiarism-app',PlagiarismApiListView,basename='plagiarism-app')

urlpatterns += root_router.urls