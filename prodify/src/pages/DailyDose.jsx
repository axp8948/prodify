import React, { useState, useEffect } from 'react';

const DailyDosePage = () => {
  const [wordData, setWordData] = useState(null);
  const apiKey = import.meta.env.VITE_WORDNIK_API_KEY

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const res = await fetch(
          `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error('Failed to fetch word of the day.');
        const data = await res.json();
        //console.log(data)
        setWordData(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (apiKey) fetchWordOfTheDay();
    else console.warn('No Wordnik API key found in .env');
  }, [apiKey]);

  if (!wordData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading Word of the Day…
      </div>
    );
  }

  const { word, definitions, examples } = wordData;
  const definitionText = definitions?.[0]?.text || 'No definition available.';

  const quoteText = '“Success usually comes to those who are too busy to be looking for it.”';
  const quoteAuthor = 'Henry David Thoreau';

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Decorative Blobs */}
      <div
        className="
          absolute -top-16 -left-16 w-56 h-56 bg-blue-600 rounded-full 
          opacity-20 mix-blend-multiply filter blur-3xl animate-pulse
        "
      />
      <div
        className="
          absolute -bottom-16 -right-16 w-64 h-64 bg-purple-600 rounded-full 
          opacity-20 mix-blend-multiply filter blur-3xl animate-bounce
        "
      />

      <div className="relative z-10 w-full max-w-4xl">
        <h1
          className="
            text-4xl sm:text-5xl font-extrabold text-center mb-16
            text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 
          "
        >
          🌟 Your Daily Dose
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* WORD CARD */}
          <div className="relative">
            <div
              className="
                absolute inset-0 transform -rotate-3 
                rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 opacity-40
              "
            />
            <div
              className="
                relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-8
                shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500
              "
            >
              <h2 className="text-3xl font-bold text-blue-400 mb-4">Word of the Day</h2>
              <div
                className="
                  text-5xl font-extrabold text-center 
                  text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600
                  mb-2
                "
              >
                {word}
              </div>
              <p className="italic text-gray-300 mb-4">
                “{definitionText}”
              </p>
              {examples[0].text && (
                <p className="text-gray-500 text-sm">➤ {examples[0].text}</p>
              )}
            </div>
          </div>

          {/* QUOTE CARD */}
          <div className="relative">
            <div
              className="
                absolute inset-0 transform rotate-3 
                rounded-2xl bg-gradient-to-br from-green-900 to-green-700 opacity-40
              "
            />
            <div
              className="
                relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-8
                shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500
              "
            >
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                Quote of the Day
              </h2>
              <p className="text-gray-200 italic text-lg mb-4">
                {quoteText}
              </p>
              <p className="text-yellow-400 font-semibold text-right">
                — {quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDosePage;
