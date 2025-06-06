import React, { useState } from 'react';

const categories = ['Any', 'Programming', 'Misc', 'Pun', 'Spooky', 'Christmas'];

const JokesPage = () => {
  const [category, setCategory] = useState('Programming');
  const [joke, setJoke] = useState(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setShowPunchline(false);
    try {
      const res = await fetch(`https://v2.jokeapi.dev/joke/${category}?blacklistFlags=nsfw,racist,sexist,explicit`);
      const data = await res.json();
      setJoke(data);
    } catch (err) {
      console.error('Failed to fetch joke:', err);
      setJoke(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1013] via-[#1a1e24] to-[#0d1013] px-4 py-16 flex flex-col items-center text-white">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text mb-10">
        Laugh Factory
      </h1>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10">
        <label className="block mb-2 font-semibold text-gray-300">Choose Your Flavor of Funny</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={fetchJoke}
          disabled={loading}
          className="w-full bg-orange-400 hover:bg-orange-500 transition-colors font-semibold px-4 py-3 rounded-md mt-2"
        >
          {loading ? 'Fetching laughs...' : 'Get a Joke'}
        </button>

        {joke && (
          <div className="mt-6 bg-gray-900/70 rounded-xl p-5 shadow-inner border border-gray-700 transition-all duration-300">
            <p className="text-lg font-medium mb-4">
              {joke.type === 'single' ? joke.joke : joke.setup}
            </p>

            {joke.type === 'twopart' && !showPunchline && (
              <button
                onClick={() => setShowPunchline(true)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold transition"
              >
                Show Punchline
              </button>
            )}

            {joke.type === 'twopart' && showPunchline && (
              <p className="mt-4 text-green-400 text-xl font-bold animate-fade-in">
                {joke.delivery}
              </p>
            )}

            {joke.type === 'single' && (
              <p className="text-green-400 font-bold text-xl mt-2 animate-bounce">😂</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JokesPage;
