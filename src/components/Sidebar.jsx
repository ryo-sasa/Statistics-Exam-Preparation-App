import React from 'react';
import { GraduationCap, Home, BookOpen, PenTool, FileText, BarChart3, User, Menu, X } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen, selectedLevel, setSelectedLevel, LEVELS }) {
  const navItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'textbook', label: '教科書', icon: BookOpen },
    { id: 'practice', label: '問題演習', icon: PenTool },
    { id: 'exam', label: '模擬試験', icon: FileText },
    { id: 'progress', label: '学習進捗', icon: BarChart3 },
    { id: 'profile', label: 'プロフィール', icon: User },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 lg:hidden z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">統計検定道場</h1>
              <p className="text-xs text-slate-300">Statistical Learning Hub</p>
            </div>
          </div>
        </div>

        {/* Level Selector */}
        <div className="p-6 border-b border-slate-700">
          <p className="text-xs font-semibold text-slate-300 uppercase mb-3">難易度を選択</p>
          <div className="space-y-2">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  selectedLevel === level.id
                    ? `${level.bgColor} text-white shadow-lg scale-105`
                    : `bg-slate-700 text-slate-200 hover:bg-slate-600`
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 text-xs text-slate-400 text-center">
          <p>© 2026 統計検定道場</p>
        </div>
      </aside>
    </>
  );
}
