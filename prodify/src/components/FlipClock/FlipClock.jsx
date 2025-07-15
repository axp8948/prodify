// src/components/SimpleClock.jsx
import React, { useEffect, useState } from 'react';

export default function SimpleClock() {
  const [now, setNow] = useState(new Date());

  // tick every minute (at start of next minute)
  useEffect(() => {
    const update = () => setNow(new Date());
    // compute ms until next minute
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      update();
      // then every 60s
      const interval = setInterval(update, 60_000);
      // cleanup interval on unmount
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [now]);

  // format to 12-hour
  let hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const period  = now.getHours() < 12 ? 'AM' : 'PM';
  const hh      = String(hours).padStart(2, '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
      <div className="relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl transform scale-110" />

        {/* Clock panel */}
        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90
                        backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10
                        flex items-baseline space-x-4">
          <span className="text-8xl font-extrabold text-gray-200 tracking-wider">
            {hh}:{minutes}
          </span>
          <span className="text-2xl font-semibold text-gray-400 uppercase">
            {period}
          </span>
        </div>
      </div>
    </div>
  );
}
