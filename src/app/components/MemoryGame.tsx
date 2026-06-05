import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Trophy, Timer, Zap, Star, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface CardItem {
  id: number;
  pairId: number;
  content: string;
  category: string;
  isQuestion: boolean;
  isFlipped: boolean;
  isMatched: boolean;
}

// Each pair: Indonesian word ↔ its emoji + English gloss
const CARD_PAIRS = [
  {
    left: "Topeng",
    right: "Mask",
    category: "Vocabulary",
  },
  {
    left: "Pertunjukan",
    right: "Performance",
    category: "Vocabulary",
  },
  {
    left: "Warisan Budaya",
    right: "Cultural Heritage",
    category: "Vocabulary",
  },
  {
    left: "What is a mask (topeng)?",
    right: "A face covering used in cultural and artistic traditions.",
    category: "Definition",
  },
  {
    left: "What is the function of a mask?",
    right: "To represent a specific character in a performance.",
    category: "Function",
  },
  {
    left: "Malangan Mask",
    right: "A traditional mask from East Java.",
    category: "Mask Type",
  },
  {
    left: "Draw the Pattern",
    right: "Create the mask sketch on cardboard.",
    category: "Learning Step",
  },
  {
    left: "Cut the Cardboard",
    right: "Cut along the sketch outline carefully.",
    category: "Learning Step",
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildCards(): CardItem[] {
  const pairs = CARD_PAIRS.flatMap((pair, idx) => [
    {
      pairId: idx,
      content: pair.left,
      category: pair.category,
      isQuestion: true,
    },
    {
      pairId: idx,
      content: pair.right,
      category: pair.category,
      isQuestion: false,
    },
  ]);

  return shuffle(pairs).map((card, index) => ({
    id: index,
    ...card,
    isFlipped: false,
    isMatched: false,
  }));
}

export function MemoryGame() {
  const [cards, setCards] = useState<CardItem[]>(buildCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const [mismatched, setMismatched] = useState<number[]>([]);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleCardClick = useCallback(
    (id: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;
      if (!started) setStarted(true);

      const newFlipped = [...flipped, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
      );

      if (newFlipped.length === 1) {
        setFlipped(newFlipped);
        return;
      }

      setMoves((m) => m + 1);
      setFlipped([]);

      const [firstId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;

      if (first.pairId === card.pairId && first.id !== card.id) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === id
              ? { ...c, isFlipped: true, isMatched: true }
              : c,
          ),
        );
        const next = matchedCount + 1;
        setMatchedCount(next);
        if (next === CARD_PAIRS.length) setFinished(true);
      } else {
        setLocked(true);
        setMismatched([firstId, id]);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === id ? { ...c, isFlipped: false } : c,
            ),
          );
          setMismatched([]);
          setLocked(false);
        }, 900);
      }
    },
    [cards, flipped, locked, matchedCount, started],
  );

  const restart = () => {
    setCards(buildCards());
    setFlipped([]);
    setMoves(0);
    setMatchedCount(0);
    setSeconds(0);
    setStarted(false);
    setFinished(false);
    setLocked(false);
    setMismatched([]);
  };

  const stars =
    moves <= CARD_PAIRS.length + 2
      ? 3
      : moves <= CARD_PAIRS.length * 2 + 4
        ? 2
        : 1;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Memory Card BIPA
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Match related concepts, vocabulary, and definitions from the
              lesson.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: Zap, label: "Langkah", value: moves },
          { icon: Timer, label: "Waktu", value: formatTime(seconds) },
          {
            icon: Trophy,
            label: "Pasangan",
            value: `${matchedCount}/${CARD_PAIRS.length}`,
          },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="p-3 md:p-4">
              <stat.icon className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-4 gap-2 md:gap-3 mb-6"
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            isMismatched={mismatched.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </motion.div>

      {/* Restart Button */}
      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button
            onClick={restart}
            variant="outline"
            size="lg"
            className="gap-2 px-8"
          >
            <RefreshCw className="w-4 h-4" />
            Restart
          </Button>
        </motion.div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-center text-white">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-3"
                >
                  🏆
                </motion.div>
                <h2 className="text-2xl font-bold mb-1">Amazing!</h2>
                <p className="text-white/80 text-sm">All pairs found!</p>

                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + s * 0.1 }}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          s <= stars
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Giliran", value: moves },
                    { label: "Waktu", value: formatTime(seconds) },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gray-50 rounded-xl p-3 text-center"
                    >
                      <p className="text-xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={restart}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryCard({
  card,
  isMismatched,
  onClick,
}: {
  card: CardItem;
  isMismatched: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="aspect-square cursor-pointer select-none"
      style={{ perspective: 700 }}
      onClick={onClick}
      whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.06 } : {}}
      whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.94 } : {}}
    >
      <motion.div
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md border-2 ${
            isMismatched
              ? "bg-red-100 border-red-300"
              : "bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400"
          }`}
        >
          <span className="text-white text-xl md:text-3xl">?</span>
        </div>

        {/* Front */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className={`absolute inset-0 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-md border-2 gap-1 p-2 ${
            card.isMatched
              ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-300"
              : card.isQuestion
                ? "bg-indigo-50 border-indigo-200"
                : "bg-purple-50 border-purple-200"
          }`}
        >
          <span className="text-[9px] md:text-xs font-medium uppercase text-purple-600">
            {card.category}
          </span>

          <span className="text-[10px] md:text-sm font-semibold text-center leading-snug">
            {card.content}
          </span>

          {card.isMatched && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs leading-none">✓</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
