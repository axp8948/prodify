// src/components/Prodix/ProdixWidgetExpanded.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare as ChatIcon,
  Mic as MicOnIcon,
  MicOff as MicOffIcon,
  User as UserIcon,
  Bot as BotAvatarIcon,
  Loader2 as SpinnerIcon,
} from "lucide-react";
import authService from "../../appwrite/auth";
import { useSelector } from "react-redux";

export default function ProdixWidgetExpanded() {
  const userData = useSelector((state) => state.auth.userData);
  const userName = userData?.name ?? "";
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Welcome back, ${userName}! 🎉 Ready to conquer today’s goals?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [summary, setSummary] = useState("");
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const endRef = useRef(null);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recog.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join("");
      sendMessage(transcript, true);
    };
    recognitionRef.current = recog;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { jwt } = await authService.createJWT();
        const resp = await fetch("/api/context", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await resp.json();
        setSummary(data.summary);
      } catch (err) {
        console.error("Failed to load context:", err);
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  const sendMessage = async (overrideText, isSpeech = false) => {
    const txt = (overrideText ?? input).trim();
    if (!txt || loading) return;
    setMessages((prev) => [...prev, { sender: "user", text: txt }]);
    setInput("");
    textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const { jwt } = await authService.createJWT();
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ message: txt, summary }),
      });
      const { reply } = await resp.json();
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      if (isSpeech) speak(reply);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = "😞 Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { sender: "bot", text: errMsg }]);
      if (isSpeech) speak(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-8">
      <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-3xl px-4 sm:px-6 md:px-10 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <ChatIcon className="w-10 h-10 text-emerald-400 shrink-0" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-lime-500 text-center sm:text-left">
            Chat with Prodix
          </h3>
        </header>

        {/* Chat log */}
        <div className="space-y-6 mb-8 px-1 sm:px-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start ${
                m.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              {m.sender === "bot" && (
                <BotAvatarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mr-2 sm:mr-4 mt-1" />
              )}
              <div
                className={`max-w-[85%] px-4 py-3 sm:p-6 rounded-3xl shadow-md ${
                  m.sender === "bot"
                    ? "bg-gray-800 text-emerald-300"
                    : "bg-gray-800 text-blue-300 ml-auto"
                }`}
              >
                <div className="prose prose-sm m-0 p-0 break-words max-w-full">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
              {m.sender === "user" && (
                <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300 ml-2 sm:ml-4 mt-1" />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start animate-pulse">
              <BotAvatarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mr-2 sm:mr-4 mt-1" />
              <div className="max-w-[85%] px-4 py-3 sm:p-6 rounded-3xl shadow-md bg-gray-800 text-emerald-300 flex items-center">
                <SpinnerIcon className="w-5 h-5 sm:w-6 sm:h-6 inline-block mr-2 animate-spin" />
                Prodix is typing…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input + Mic + Send */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-4 border-t border-gray-700 pt-6">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), sendMessage(undefined, false))
            }
            disabled={loading}
            placeholder="Type your message…"
            className="flex-1 resize-none w-full sm:w-auto bg-gray-800 text-gray-100 border border-gray-600 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-500 text-sm sm:text-base"
          />

          {/* Mic */}
          <button
            onClick={toggleListening}
            disabled={loading}
            className="w-full sm:w-auto p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={listening ? "Stop listening" : "Start speaking"}
          >
            {listening ? (
              <MicOffIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            ) : (
              <MicOnIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>

          {/* Send */}
          <button
            onClick={() => sendMessage(undefined, false)}
            disabled={loading}
            className="w-full sm:w-auto p-3 sm:p-4 bg-gradient-to-r from-emerald-400 to-lime-500 rounded-2xl shadow-lg hover:from-emerald-300 hover:to-lime-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <SpinnerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
            ) : (
              <ChatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
