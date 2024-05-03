import React, { useEffect, useState } from 'react';
import { Message } from "../../../interfaces/Message";
import { Dialog } from "../../../interfaces/Dialog";
import styles from "./DialogArea.module.css";

interface MesssageComponentProps {
  message: Message;
}

const MesssageComponent: React.FC<MesssageComponentProps> = ({ message }) => {
  return (
    <div className={styles.MessageWrapper}>
      <div className={`${styles.Message} ${message.type === "ASK" ? styles.Right : styles.Left}`}>
        {message.content}
      </div>
    </div>
  );
};

interface DialogAreaProps {
  dialog: Dialog | undefined;
  setDialog: React.Dispatch<React.SetStateAction<Dialog | undefined>>,
}

const DialogArea: React.FC<DialogAreaProps> = ({ dialog, setDialog }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const convertJsonToMessage = (jsonData: any): Message => {
    const message: Message = {
      type: jsonData.type,
      content: jsonData.content,
      timestamp: jsonData.timestamp,
    };
    return message;
  };

  const handleSendMessage = async () => {
    if (!dialog) {
      return;
    }
    const requestBody = {
      dialog_id: dialog.id,
      content: message,
    };
    setMessage('');
    const timestamp = Date.now().toString();
    const newMessage: Message = { type: 'ASK', content: requestBody.content, timestamp };
    setMessages([...messages, newMessage]);
    if (!dialog.start_with) {
      console.log("update");
      const newDialog: Dialog = {
        id: dialog.id,
        start_with: newMessage.content,
        updated_at: newMessage.timestamp,
      }
      setDialog(newDialog);
    }

    try {
      const response = await fetch('http://localhost:8000/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const responseData = await response.json();
      const receivedMessage = convertJsonToMessage(responseData);
      setMessages([...messages, newMessage, receivedMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/dialogs/${dialog?.id}/story/`);
        if (!response.ok) {
          throw new Error('Failed to fetch dialogs');
        }
        const data = await response.json();
        const sortedMessages = data.map((d: any) => convertJsonToMessage(d)).sort(
          (a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error(error);
      }
    };
    if (dialog) {
      fetchData();
    }
  }, [dialog]);

  return (
    <>
      <div className={styles.DialogAreaContainet}>
        {messages.map((message) => (
          <MesssageComponent key={message.timestamp} message={message} />
        ))}
      </div>
      <div className={styles.DialogInput}>
        <input
          className={styles.Input}
          placeholder="Задайте вопрос..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.Button} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </>
  );
};

export default DialogArea;