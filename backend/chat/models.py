from django.db import models


class Dialog(models.Model):
    start_with = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    dialog = models.ForeignKey(Dialog, on_delete=models.CASCADE, related_name="messages")
    content = models.CharField()
    type = models.CharField(max_length=6) # ASK / ANSWER
    timestamp = models.DateTimeField(auto_now_add=True)
