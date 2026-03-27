import { useState, useCallback, useEffect } from "react";
import { Menu, Flame, User, Sparkles } from "lucide-react";

// Data imports
import { LEVELS, TOPICS, QUESTIONS, EXAM_QUESTIONS, ALL_QUESTIONS } from "./data/index.js";

// User management
import {
  signUp, login, logout, getCurrentUser,
  saveResult, getResults, getStats, getStreak,
  saveSelectedLevel, getSelectedLevel,
  updateProfile, resetProgress,
  toggleBookmark, getBookmarks,
} from "./lib/userStore.js";

// Component imports
import AuthPage from "./components/AuthPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import HomePage from "./components/HomePage.jsx";
import TextbookPage from "./components/TextbookPage.jsx";
import PracticePage from "./components/PracticePage.jsx";
import ExamPage from "./components/ExamPage.jsx";
import ProgressPage from "./components/ProgressPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ChatPopup from "./components/ChatPopup.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("jun1kyu");
  const [useAI, setUseAI] = useState(() => {
    try { return localStorage.getItem('stat_app_use_ai') === 'true'; } catch { return false; }
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    studyDays: 0,
    streak: 0,
  });

  // Check for existing session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const level = await getSelectedLevel();
          setSelectedLevel(level);
          const r = await getResults();
          setResults(r);
          const s = await getStats();
          setStats(s);
          const b = await getBookmarks();
          setBookmarks(b);
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
      setAuthChecked(true);
    };
    init();
  }, []);

  // Handle auth
  const handleAuth = useCallback(async (mode, credentials) => {
    if (mode === 'guest') {
      setIsGuest(true);
      setUser({ name: 'ゲスト', email: null });
      return { success: true };
    }

    let result;
    if (mode === 'signup') {
      result = await signUp(credentials.name, credentials.email, credentials.password);
    } else {
      result = await login(credentials.email, credentials.password);
    }

    if (result.success) {
      setUser(result.user);
      setIsGuest(false);
      const level = await getSelectedLevel();
      setSelectedLevel(level);
      const r = await getResults();
      setResults(r);
      const s = await getStats();
      setStats(s);
      const b = await getBookmarks();
      setBookmarks(b);
    }
    return result;
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
    setIsGuest(false);
    setCurrentPage("home");
    setResults([]);
    setBookmarks([]);
    setStats({ totalAnswered: 0, totalCorrect: 0, studyDays: 0, streak: 0 });
  }, []);

  // Handle level change
  const handleSetSelectedLevel = useCallback(async (level) => {
    setSelectedLevel(level);
    if (!isGuest) await saveSelectedLevel(level);
  }, [isGuest]);

  // Handle result
  const addResult = useCallback(async (result) => {
    const resultWithTime = { ...result, timestamp: Date.now() };
    setResults((prev) => [...prev, resultWithTime]);

    if (!isGuest) {
      await saveResult(resultWithTime);
      const s = await getStats();
      setStats(s);
    } else {
      setStats((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (result.isCorrect ? 1 : 0),
      }));
    }
  }, [isGuest]);

  // Handle AI toggle
  const handleToggleAI = useCallback((checked) => {
    setUseAI(checked);
    try { localStorage.setItem('stat_app_use_ai', String(checked)); } catch {}
  }, []);

  // Handle bookmark toggle
  const handleToggleBookmark = useCallback(async (questionId) => {
    setBookmarks(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
    if (!isGuest) {
      await toggleBookmark(questionId);
    }
  }, [isGuest]);

  // Handle profile update
  const handleUpdateProfile = useCallback(async (updates) => {
    const result = await updateProfile(updates);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  // Handle reset
  const handleResetProgress = useCallback(async () => {
    await resetProgress();
    setResults([]);
    setBookmarks([]);
    const s = await getStats();
    setStats(s);
  }, []);

  // Show loading while checking auth
  if (!authChecked) return null;

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleAuth} />;
  }

  const topics = TOPICS[selectedLevel] || [];
  const questions = QUESTIONS[selectedLevel] || [];
  const examQuestions = EXAM_QUESTIONS[selectedLevel] || [];
  const allQuestions = ALL_QUESTIONS[selectedLevel] || [];
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
            questionCount={allQuestions.length}
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
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            useAI={useAI}
          />
        );
      case "exam":
        return (
          <ExamPage
            selectedLevel={selectedLevel}
            questions={examQuestions}
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
            questions={allQuestions}
            setCurrentPage={setCurrentPage}
          />
        );
      case "profile":
        return (
          <ProfilePage
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onResetProgress={handleResetProgress}
            onLogout={handleLogout}
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
            questionCount={allQuestions.length}
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
        setSelectedLevel={handleSetSelectedLevel}
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
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none" title="生成AIによる回答評価・チャット応答を有効にする">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => handleToggleAI(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Sparkles size={14} className={useAI ? 'text-purple-500' : 'text-gray-400'} />
              <span className={`text-xs font-medium hidden sm:inline ${useAI ? 'text-purple-600' : 'text-gray-400'}`}>AI</span>
            </label>
            <div className="flex items-center gap-1 text-sm">
              <Flame size={16} className="text-orange-500" />
              <span className="font-medium text-gray-700">{stats.streak}</span>
            </div>
            <button
              onClick={() => setCurrentPage("profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                {user?.name || 'ユーザー'}
              </span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">{renderPage()}</main>
      </div>

      {showChat && <ChatPopup selectedLevel={selectedLevel} visible={showChat} useAI={useAI} />}
    </div>
  );
}
