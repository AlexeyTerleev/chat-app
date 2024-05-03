
import os
from openai import OpenAI, chat
from typing import Optional
from chat.models import Message, Dialog

class Service:
    def __init__(self):
        self._ai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


    def execute(self, dialog) -> str:
        messages = dialog.messages.all()
        transformed = [{
            "role": "system" if message.type == "ANSWER" else "user",
            "content": message.content,
        } for message in messages]

        print(transformed)

        completion = chat.completions.create(
            model="gpt-3.5-turbo",
            messages=transformed,
        )

        response_content = completion.choices[0].message.content

        return str(response_content)