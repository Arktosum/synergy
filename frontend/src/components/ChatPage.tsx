import { useEffect, useState } from "react";

interface Message {
  sender: string;
  content: string;
}
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

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
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="p-5 bg-inherit border-2 border-green-500 text-white"
        />
        <button onClick={()=>{
            setMessages(prev=>[...prev,{content: message,sender:username}])
        }}
        className="text-green-600 px-5 py-2">Send!</button>
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
