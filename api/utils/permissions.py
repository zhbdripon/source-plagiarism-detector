from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    message = "Only owner can write"
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class IsOwner(permissions.BasePermission):
    message = 'You are not the owner of this object'
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class AnonAndUserCreatePermisssion(permissions.BasePermission):
    def has_permission(self,request,view):
        return request.method == 'POST' or bool(request.user and request.user.is_authenticated)

class UserAndPublicListPermisssion(permissions.BasePermission):
    def has_permission(self,request,view):
        return bool(request.method == 'GET' and request.user and (request.user.is_authenticated or request.user.is_anonymous))