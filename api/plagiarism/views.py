from rest_framework import permissions as drf_permissions
from utils import permissions as custom_permissions

from plagiarism.models import Plagiarism, SourceCode
from plagiarism.serializers import PlagiarismSerializer, SourceCodeSerializer

from rest_framework import mixins
from rest_framework import generics
from rest_framework.response import Response

from django.http import QueryDict


class PlagiarismList(generics.ListCreateAPIView):
    serializer_class = PlagiarismSerializer
    permission_classes = [ custom_permissions.AnonAndUserCreatePermisssion | custom_permissions.UserAndPublicListPermisssion ]
    
    def get_queryset(self):
        return Plagiarism.objects.filter(owner=(self.request.user if self.request.user.is_authenticated else None))

    def perform_create(self, serializer):
        serializer.save(owner=(self.request.user if self.request.user.is_authenticated else None))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if type(self.request.data) == type(QueryDict("")):
            source_data = [
                {'file':file,'base':tuple[0]=='base'} 
                for tuple in self.request.data.lists() if (tuple[0]=='source' or tuple[0]=='base') 
                for file in tuple[1]
            ]
            context.update({"source_data": source_data})
        return context

class PlagiarismDetail(generics.RetrieveUpdateAPIView):
    serializer_class = PlagiarismSerializer
    permission_classes = [custom_permissions.IsOwner]

    def get_queryset(self):
        pk = self.kwargs['pk']
        return Plagiarism.objects.filter(pk=pk)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


class FileList(generics.ListCreateAPIView):
    serializer_class = SourceCodeSerializer
    queryset = SourceCode.objects.all()

class FileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = SourceCodeSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        return SourceCode.objects.filter(pk=pk)