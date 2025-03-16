import React, { useEffect, useState } from "react";
import socket  from "./socket";
interface Message {
  user: string;
  text: string;
  createdAt?: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    // socket.on("init", (msgs: Message[]) => {
    //   setMessages(msgs);
    // });

    socket.on("recieve-message", (msg: Message) => {
      console.log(msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      // socket.off("init");
      socket.off("recieve-message");
    };
  }, []);

  const sendMessage = () => {
    if (text && user) {
      const msg = { user, text };
      socket.emit("send-message", msg);
      setText("");
    }
  };

  return (
    <div className="bg-black min-h-[100vh] text-white flex flex-col items-center">
      <div className="text-white my-2 font-bold">Send a Message!!!!!</div>
      <div className="my-5">
        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-green-600 border-2 rounded-xl"
        />
      </div>
      <div className="my-5">
        <input
          type="text"
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-5 border-green-600 border-2 rounded-xl"
        />
      </div>
      <button
        className="px-5 py-5 bg-green-600 rounded-xl"
        onClick={sendMessage}
      >
        Send Message
      </button>
      <div className="overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.text}{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
