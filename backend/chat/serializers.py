from rest_framework import serializers
from chat.models import Dialog, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'dialog', 'content', 'type', 'timestamp']
        read_only_fields = ['id', 'timestamp']

class DialogSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Dialog
        fields = ['id', 'start_with', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at', 'messages']