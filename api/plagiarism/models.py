from django.db import models
from utils.data import LANGUAGE_CHOICES

# Create your models here.
class Plagiarism(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    owner = models.ForeignKey('auth.User', blank=True, null=True, on_delete=models.CASCADE)
    result = models.URLField(max_length=200,null=True)

    class Meta:
        ordering = ["created"]

    def __str__( self ):    
        return "{0} {1} {2}".format(self.id, self.language, self.language)


class SourceCode(models.Model):
    file = models.FileField(upload_to='uploads/', max_length=100)
    base = models.BooleanField(null=False,blank=False)
    plagiarism = models.ForeignKey(Plagiarism, related_name='sources', on_delete=models.CASCADE)

    def get_file(self):
        return self.file
