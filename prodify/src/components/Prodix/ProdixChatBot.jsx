// src/components/Prodix/ProdixWidgetExpanded.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare as ChatIcon,
  User as UserIcon,
  Bot as BotAvatarIcon,
} from "lucide-react";

export default function ProdixWidgetExpanded() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome back, Anmol! 🎉 Ready to conquer today’s goals?" },
  ]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const endRef = useRef(null);

  // Auto–scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto–resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const sendMessage = () => {
    const txt = input.trim();
    if (!txt) return;
    setMessages((prev) => [...prev, { sender: "user", text: txt }]);
    setInput("");
    // reset height
    textareaRef.current.style.height = "auto";

    // mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "👍 Got it! I'm on it…" },
      ]);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto p-1 bg-gradient-to-r from-emerald-400 to-lime-500 rounded-3xl">
      <div className="bg-card shadow-2xl rounded-3xl p-10 dark:bg-gray-800">
        {/* Header */}
        <header className="flex items-center mb-8">
          <ChatIcon className="w-12 h-12 text-emerald-500" />
          <h3 className="ml-4 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-lime-500">
            Chat with Prodix
          </h3>
        </header>

        {/* Chat window (auto-growing) */}
        <div className="space-y-6 mb-8 px-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start ${
                m.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              {m.sender === "bot" && (
                <BotAvatarIcon className="w-8 h-8 text-emerald-400 mr-4 mt-1" />
              )}
              <div
                className={`max-w-[85%] p-6 rounded-3xl shadow-md ${
                  m.sender === "bot"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-blue-50 text-blue-800 ml-auto"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <UserIcon className="w-8 h-8 text-blue-400 ml-4 mt-1" />
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input area with auto-growing textarea */}
        <div className="flex items-end space-x-4 border-t pt-6">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your message…"
            className="
              flex-1 resize-none bg-white dark:bg-gray-700
              border border-gray-300 dark:border-gray-600
              rounded-2xl px-6 py-3
              focus:outline-none focus:ring-2 focus:ring-emerald-400
              placeholder-gray-400
            "
          />
          <button
            onClick={sendMessage}
            className="
              p-4 bg-gradient-to-r from-emerald-400 to-lime-500
              rounded-2xl shadow-lg
              hover:from-emerald-500 hover:to-lime-600
              transition
            "
          >
            <ChatIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
