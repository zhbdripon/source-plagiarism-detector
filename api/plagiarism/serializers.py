from rest_framework import serializers
from django.contrib.auth.models import User
from django.conf import settings

from plagiarism.models import Plagiarism, SourceCode
from utils.exceptions import ServiceUnavailable
from utils.data import EXTENSION_OF, LANGUAGE_CHOICES

import os
import mosspy

class SourceCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceCode
        fields = ["file","base","plagiarism"]

    def validate(self, data):
        language = data['plagiarism'].language
        supported_extensions = EXTENSION_OF[language]
        extension = os.path.splitext(data['file'].name)[1][1:]
        if extension not in supported_extensions:
            raise serializers.ValidationError('Supported extensions are : {0}'.format(supported_extensions))
        return data


class PlagiarismSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    sources = SourceCodeSerializer(many=True, read_only=True)

    class Meta:
        model = Plagiarism
        fields = ["id","created","language","result","owner","sources"]

    def run_plagiarsim(self,language,base_source,submission_source):
        moss = mosspy.Moss(settings.MOSSID, language)
        moss.set_in_mem_base_files(base_source)
        moss.set_in_mem_submission_files(submission_source)
        return moss.send()

    def create(self, validated_data):
        instance = Plagiarism.objects.create(**validated_data)

        source_files = self.context['source_data']
        
        for data in source_files:
            data.update({'plagiarism':instance.id})

        submission_source = [data['file'] for data in source_files if not data['base']]
        base_source = [data['file'] for data in source_files if data['base']]

        serialized_sources = SourceCodeSerializer(data=source_files,many = True)

        if(serialized_sources.is_valid() and len(submission_source) >= 2):
            try:
                instance.result = self.run_plagiarsim(instance.language,base_source,submission_source)
            except Exception as e:
                instance.delete()
                raise ServiceUnavailable()

            serialized_sources.save()
            instance.save()
            return instance
        else:
            instance.delete()
            if not serialized_sources.is_valid():
                raise serializers.ValidationError(serialized_sources.errors)
            raise serializers.ValidationError('minimum two source file required')

        