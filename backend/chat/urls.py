from django.urls import path, include
from chat.views import DialogViewSet, MessageViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'dialogs', DialogViewSet, basename='dialog')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls))
]