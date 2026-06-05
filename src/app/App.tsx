import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Gamepad2 } from "lucide-react";
import { LearningModule } from "./components/LearningModule";
import { MemoryGame } from "./components/MemoryGame";

type Tab = "learn" | "game";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("learn");

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "learn", label: "Pembelajaran", icon: BookOpen },
    { key: "game", label: "Permainan", icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-gradient from-blue-50 via-indigo-50 to-purple-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 md:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Topeng Kata</span>
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-3 md:px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "learn" ? (
            <LearningModule onNavigateToGame={() => setActiveTab("game")} />
          ) : (
            <MemoryGame />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
