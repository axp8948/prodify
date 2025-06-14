// src/pages/JokesPage.jsx
import React, { useState, useEffect } from "react";
import {
  Speaker,
  VolumeX
} from "lucide-react";

const FLAVORS = [
  { key: "Any",       label: "Any",         emoji: "🤪" },
  { key: "Programming", label: "Programming", emoji: "💻" },
  { key: "Misc",       label: "Misc",        emoji: "🎲" },
  { key: "Pun",        label: "Pun",         emoji: "😛" },
  { key: "Spooky",     label: "Spooky",      emoji: "🎃" },
  { key: "Christmas",  label: "Christmas",   emoji: "🎄" },
];

export default function JokesPage() {
  const [category, setCategory]       = useState("Programming");
  const [joke, setJoke]               = useState(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [voiceEnabled, setVoiceEnabled]   = useState(true);

  // Speak helper
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  };

  const fetchJoke = async () => {
    setLoading(true);
    setShowPunchline(false);
    try {
      const res = await fetch(
        `https://v2.jokeapi.dev/joke/${category}?blacklistFlags=nsfw,racist,sexist,explicit`
      );
      const data = await res.json();
      setJoke(data);
      // voice-over the setup or single joke
      if (data.type === "single") {
        speak(data.joke);
      } else {
        speak(data.setup);
      }
    } catch (err) {
      console.error("Failed to fetch joke:", err);
      setJoke(null);
    } finally {
      setLoading(false);
    }
  };

  // When punchline revealed, speak it
  useEffect(() => {
    if (showPunchline && joke?.type === "twopart") {
      speak(joke.delivery);
    }
  }, [showPunchline, joke]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1013] via-[#1a1e24] to-[#0d1013] px-4 py-16 flex flex-col items-center text-white">
      {/* Header + Voice Toggle */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center flex-1
                       bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600
                       text-transparent bg-clip-text">
          Laugh Factory
        </h1>
        <button
          onClick={() => setVoiceEnabled((v) => !v)}
          className="ml-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          title={voiceEnabled ? "Mute voice" : "Enable voice"}
        >
          {voiceEnabled
            ? <Speaker className="w-6 h-6 text-white"/>
            : <VolumeX className="w-6 h-6 text-white"/>}
        </button>
      </div>

      {/* Flavor Cards */}
      <div className="w-full max-w-lg flex flex-wrap gap-3 justify-center mb-6">
        {FLAVORS.map((f) => (
          <button
            key={f.key}
            onClick={() => setCategory(f.key)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full
              ${
                category === f.key
                  ? "bg-purple-600 scale-105 shadow-lg"
                  : "bg-gray-800 hover:bg-gray-700"
              }
              transition transform
            `}
          >
            <span className="text-xl">{f.emoji}</span>
            <span className="text-sm font-medium">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Card Container */}
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
        <button
          onClick={fetchJoke}
          disabled={loading}
          className="w-full bg-orange-400 hover:bg-orange-500 transition-colors
                     font-semibold px-4 py-3 rounded-md mb-4"
        >
          {loading ? "Fetching laughs..." : "Get a Joke"}
        </button>

        {joke && (
          <div className="flip-card w-full h-auto">
            <div className={`flip-card-inner ${showPunchline ? "flipped" : ""}`}>
              {/* Front Face */}
              <div className="flip-card-front bg-gray-900/70 rounded-xl p-5 shadow-inner
                              border border-gray-700">
                <p className="text-lg font-medium mb-4">
                  {joke.type === "single" ? joke.joke : joke.setup}
                </p>
                {joke.type === "twopart" && (
                  <button
                    onClick={() => setShowPunchline(true)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold transition"
                  >
                    Show Punchline
                  </button>
                )}
                {joke.type === "single" && (
                  <p className="text-green-400 font-bold text-xl mt-2 animate-bounce">
                    😂
                  </p>
                )}
              </div>

              {/* Back Face */}
              {joke.type === "twopart" && (
                <div className="flip-card-back bg-gray-900/70 rounded-xl p-5 shadow-inner
                                border border-gray-700 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold mb-4">{joke.delivery}</p>
                  <button
                    onClick={() => setShowPunchline(false)}
                    className="mt-2 text-sm text-gray-300 hover:underline"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
