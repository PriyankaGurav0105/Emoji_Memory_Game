/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

const allEmojis = ["🍎", "🚀", "🎸", "🐱", "🌟", "🍕", "🎈", "🐶", "🍩", "🎮", "🐼", "🌈", "⚽", "🦄", "🎁", "🎨"];

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state
  const gridSize = 4; // Fixed grid size is 4x4

  useEffect(() => {
    shuffleCards(gridSize);
  }, []);

  const shuffleCards = (size) => {
    const totalCards = size * size; // Total cards based on grid size
    const selectedEmojis = allEmojis.slice(0, totalCards / 2);
    const shuffled = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
      }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsRunning(true);
    setShowConfetti(false); // Reset confetti when restarting
  };

  const handleFlip = (id) => {
    if (flipped.length < 2 && !flipped.includes(id)) {
      setFlipped((prev) => [...prev, id]);
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched((prev) => [...prev, cards[first].emoji]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === cards.length / 2) {
      setIsRunning(false);
      setShowConfetti(true); // Trigger confetti only when game is won
    }
  }, [matched]);

  // Reset confetti on page load or game restart
  useEffect(() => {
    setShowConfetti(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 className="text-3xl font-bold mb-4">Emoji Memory Game</h1>
      <p className="text-lg mb-4">Moves: {moves}</p>

      {matched.length === cards.length / 2 && (
        <p className="text-green-500 font-semibold">You Win! 🎉</p>
      )}

      <div
        className={`grid grid-cols-${gridSize} gap-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 bg-white border rounded-lg shadow-md cursor-pointer transform transition-transform ${
              flipped.includes(index) || matched.includes(card.emoji)
                ? "rotate-y-180"
                : ""
            } ${
              matched.includes(card.emoji) ? "animate-bounce" : ""
            }`}
            onClick={() => handleFlip(index)}
          >
            <div
              className={`absolute w-full h-full flex items-center justify-center text-2xl ${
                flipped.includes(index) || matched.includes(card.emoji)
                  ? "visible"
                  : "invisible"
              }`}
            >
              {card.emoji}
            </div>
            <div
              className={`absolute w-full h-full bg-gray-200 rounded-lg flex items-center justify-center ${
                flipped.includes(index) || matched.includes(card.emoji)
                  ? "hidden"
                  : "block"
              }`}
            >
              ❓
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={() => shuffleCards(gridSize)}
      >
        Restart Game
      </button>
    </div>
  );
};

export default App;
