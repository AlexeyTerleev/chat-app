from rest_framework.views import APIView


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from chat.models import Dialog, Message
from chat.serializers import DialogSerializer, MessageSerializer
from chat.services import Service

class DialogViewSet(viewsets.ModelViewSet):
    queryset = Dialog.objects.all()
    serializer_class = DialogSerializer

    def create(self, request):
        serializer = DialogSerializer(data=request.data)
        if serializer.is_valid():
            dialog = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        dialogs = self.get_queryset()
        serializer = DialogSerializer(dialogs, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def story(self, request, pk=None):
        dialog = self.get_object()
        messages = Message.objects.filter(dialog=dialog).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        dialog_id = request.data.get('dialog_id')
        content = request.data.get('content')

        try:
            dialog = Dialog.objects.get(id=dialog_id)
        except Dialog.DoesNotExist:
            return Response({"error": "Dialog does not exist."}, status=status.HTTP_404_NOT_FOUND)

        Message.objects.create(
            dialog=dialog,
            content=content,
            type='ASK'
        )

        if not dialog.start_with:
            dialog.start_with = content[:254]
            dialog.save()
 
        response = get_response(dialog)
        serializer = MessageSerializer(response)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

def get_response(dialog):
    answer = Service().execute(dialog)
    response = Message.objects.create(
        dialog=dialog,
        content=answer,
        type='ANSWER'
    )
    return response