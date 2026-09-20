import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello!"
    }
  ]);
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const sendMessage = async () => {

    if (input.trim() === "") return;

    const userMessage = input;

    setMessages((prevMessages) => [
        ...prevMessages,
        {
            sender: "user",
            text: userMessage
        }
    ]);

    setInput("");

    try {

        console.log("Sending request...");

        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        console.log("Response received:", response);

        const data = await response.json();

        console.log("AI Reply:", data);

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: "bot",
                text: data.reply
            }
        ]);

    } catch (error) {

        console.error("Frontend Error:", error);

    }

  };





  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="container">

      <div className="chatBox">

        <h1>Personal AI</h1>

        <div className="messages">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={msg.sender}
            >
              {msg.text}
            </div>

          ))}
          <div ref={messagesEndRef}></div>

        </div>

        <div className="inputArea">

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;