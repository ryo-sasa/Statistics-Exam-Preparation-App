import { useState, useCallback } from "react";
import { Menu, Flame } from "lucide-react";

// Data imports
import { LEVELS, TOPICS, QUESTIONS } from "./data/index.js";

// Component imports
import Sidebar from "./components/Sidebar.jsx";
import HomePage from "./components/HomePage.jsx";
import TextbookPage from "./components/TextbookPage.jsx";
import PracticePage from "./components/PracticePage.jsx";
import ExamPage from "./components/ExamPage.jsx";
import ProgressPage from "./components/ProgressPage.jsx";
import ChatPopup from "./components/ChatPopup.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("jun1kyu");
  const [results, setResults] = useState([]);

  const addResult = useCallback((result) => {
    setResults((prev) => [...prev, { ...result, timestamp: Date.now() }]);
  }, []);

  const topics = TOPICS[selectedLevel] || [];
  const questions = QUESTIONS[selectedLevel] || [];

  const stats = {
    totalAnswered: results.length,
    totalCorrect: results.filter((r) => r.correct).length,
    studyDays: 1,
    streak: 1,
  };

  const showChat = currentPage !== "exam";
  const currentLevel = LEVELS.find((l) => l.id === selectedLevel);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            selectedLevel={selectedLevel}
            stats={stats}
            LEVELS={LEVELS}
            topicCount={topics.length}
            questionCount={questions.length}
          />
        );
      case "textbook":
        return (
          <TextbookPage
            selectedLevel={selectedLevel}
            topics={topics}
            LEVELS={LEVELS}
          />
        );
      case "practice":
        return (
          <PracticePage
            selectedLevel={selectedLevel}
            questions={questions}
            topics={topics}
            addResult={addResult}
          />
        );
      case "exam":
        return (
          <ExamPage
            selectedLevel={selectedLevel}
            questions={questions}
            addResult={addResult}
            LEVELS={LEVELS}
          />
        );
      case "progress":
        return (
          <ProgressPage
            selectedLevel={selectedLevel}
            results={results}
            topics={topics}
          />
        );
      default:
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            selectedLevel={selectedLevel}
            stats={stats}
            LEVELS={LEVELS}
            topicCount={topics.length}
            questionCount={questions.length}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        LEVELS={LEVELS}
      />

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600"
          >
            <Menu size={24} />
          </button>
          <div className="text-sm text-gray-500">
            統計検定{currentLevel?.name} — {currentLevel?.description}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <Flame size={16} className="text-orange-500" />
              <span className="font-medium text-gray-700">{stats.streak}</span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{renderPage()}</main>
      </div>

      {showChat && <ChatPopup selectedLevel={selectedLevel} visible={showChat} />}
    </div>
  );
}
