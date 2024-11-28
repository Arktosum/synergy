import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
}

const SOCKET_URL = "https://synergy-g20h.onrender.com"
// const SOCKET_URL = 'http://localhost:3001'

const socket = io(SOCKET_URL);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const messageElements = messages.map((message) => {
    return <Message message={message} />;
  });
  return (
    <div className="h-screen bg-black p-5">
      <div className="text-white">Current name : {username}</div>
      <form className="flex gap-5 items-center">
        <label htmlFor="name" className="text-white">
          Name:
        </label>
        <input
          type="text"
          name="name"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="p-5 bg-inherit border-2 border-green-500 text-white"
        />
      </form>
      <div className="flex gap-5 items-center">
        <label htmlFor="message" className="text-white">
          Message:
        </label>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="p-5 bg-inherit border-2 border-green-500 text-white"
        />
        <button
          onClick={() => {
            const new_message = { content: message, sender: username };
            setMessages((prev) => [...prev, new_message]);
            setMessage("");
            socket.emit("sendMessage", new_message);
          }}
          className="text-green-600 px-5 py-2"
        >
          Send!
        </button>
      </div>

      <div className="text-xl text-white font-bold">Messages: </div>
      <div>{messageElements}</div>
    </div>
  );
}

function Message({ message }: { message: Message }) {
  return (
    <div className="text-white flex gap-5">
      <div>{message.sender} : </div>
      <div>{message.content}</div>
    </div>
  );
}
