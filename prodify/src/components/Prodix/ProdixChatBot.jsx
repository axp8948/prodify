// src/components/Prodix/ProdixWidgetExpanded.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare    as ChatIcon,
  Mic              as MicOnIcon,
  MicOff           as MicOffIcon,
  User             as UserIcon,
  Bot              as BotAvatarIcon,
  Loader2          as SpinnerIcon,
} from "lucide-react";
import authService from "../../appwrite/auth";

export default function ProdixWidgetExpanded() {
  const [messages, setMessages]   = useState([
    { sender: "bot", text: "Welcome back, Anmol! 🎉 Ready to conquer today’s goals?" },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const [summary, setSummary]     = useState("");
  const recognitionRef            = useRef(null);
  const textareaRef               = useRef(null);
  const endRef                    = useRef(null);

  // — Helper: speak text via TTS —
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  // — SpeechRecognition setup —
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous     = false;
    recog.interimResults = false;
    recog.lang           = "en-US";

    recog.onstart = () => setListening(true);
    recog.onend   = () => setListening(false);
    recog.onerror = () => setListening(false);

    recog.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join("");
      sendMessage(transcript);
    };

    recognitionRef.current = recog;
  }, []);

  // — Fetch initial context summary —
  useEffect(() => {
    (async () => {
      try {
        const { jwt } = await authService.createJWT();
        const resp     = await fetch("/api/context", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const { summary } = await resp.json();
        setSummary(summary);
      } catch (err) {
        console.error("Failed to load context:", err);
      }
    })();
  }, []);

  // — Scroll to bottom on new messages —
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // — Auto-resize textarea —
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  // — Toggle mic listening —
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    listening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
  };

  // — Send both typed & spoken messages —
  const sendMessage = async (overrideText) => {
    const txt = (overrideText ?? input).trim();
    if (!txt || loading) return;

    // add user bubble
    setMessages(prev => [...prev, { sender: "user", text: txt }]);
    setInput("");
    textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const { jwt } = await authService.createJWT();
      const resp = await fetch("/api/chat", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${jwt}`,
        },
        body: JSON.stringify({ message: txt, summary }),
      });
      const { reply } = await resp.json();

      // append bot bubble
      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
      // speak the reply
      speak(reply);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = "😞 Oops! Something went wrong. Please try again.";
      setMessages(prev => [...prev, { sender: "bot", text: errMsg }]);
      speak(errMsg);
    } finally {
      setLoading(false);
    }
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

        {/* Chat log */}
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
                <div className="prose prose-sm m-0 p-0 break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
              {m.sender === "user" && (
                <UserIcon className="w-8 h-8 text-blue-400 ml-4 mt-1" />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start animate-pulse">
              <BotAvatarIcon className="w-8 h-8 text-emerald-400 mr-4 mt-1" />
              <div className="max-w-[85%] p-6 rounded-3xl shadow-md bg-emerald-50 text-emerald-800">
                <SpinnerIcon className="w-6 h-6 inline-block mr-2 animate-spin" />
                Prodix is typing…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input with Mic next to textarea */}
        <div className="flex items-end space-x-4 border-t pt-6">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey &&
              (e.preventDefault(), sendMessage())
            }
            disabled={loading}
            placeholder="Type your message…"
            className="flex-1 resize-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400"
          />

          {/* Mic toggle */}
          <button
            onClick={toggleListening}
            disabled={loading}
            className="p-3 rounded-full bg-emerald-100 hover:bg-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={listening ? "Stop listening" : "Start speaking"}
          >
            {listening ? (
              <MicOffIcon className="w-6 h-6 text-red-500 animate-pulse" />
            ) : (
              <MicOnIcon className="w-6 h-6 text-emerald-500" />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="p-4 bg-gradient-to-r from-emerald-400 to-lime-500 rounded-2xl shadow-lg hover:from-emerald-500 hover:to-lime-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <SpinnerIcon className="w-6 h-6 text-white animate-spin" />
            ) : (
              <ChatIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
