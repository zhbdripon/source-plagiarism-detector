from django.urls import path, include
from . import views

urlpatterns = [
    path('plagiarism',views.PlagiarismList.as_view(),name='plagiarism-list'),
    path('plagiarism/<int:pk>',views.PlagiarismDetail.as_view(),name='plagiarism-detail'),
    path('source',views.FileList.as_view(),name='source-list'),
    path('source/<int:pk>',views.FileDetail.as_view(),name='source-detail')
]