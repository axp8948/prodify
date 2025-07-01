// src/pages/ChatPage.jsx
import React from "react";
import ProdixWidgetEnhanced from "../components/Prodix/ProdixChatBot";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0d1013]">
    <div className="p-8 flex flex-col items-center">
      {/* 🔥 Bold, gradient heading */}
      <h1
        className="
          text-4xl font-extrabold 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-emerald-400 to-lime-500
          mb-8
        "
      >
        Ready to power up your day?  Chat with Prodix!
      </h1>

      {/* 💬 The chat widget */}
      <ProdixWidgetEnhanced />
    </div>
     </div>
  );
}
