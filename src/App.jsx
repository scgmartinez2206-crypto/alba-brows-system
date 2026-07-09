import React, { useState } from 'react';
import { Menu, X, Home, CheckCircle, Calendar, Zap, BookOpen, ShoppingBag } from 'lucide-react';
import Dashboard from './components/Dashboard';
import DailyChecklist from './components/DailyChecklist';
import Cronograma from './components/Cronograma';
import LeadScorer from './components/LeadScorer';
import GuionesObjeciones from './components/GuionesObjeciones';
import Productos from './components/Productos';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-600 to-blue-700' },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle, color: 'from-green-600 to-green-700' },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar, color: 'from-purple-600 to-purple-700' },
    { id: 'leadscorer', label: 'Lead Scorer', icon: Zap, color: 'from-yellow-600 to-yellow-700' },
    { id: 'guiones', label: 'Guiones', icon: BookOpen, color: 'from-red-600 to-red-700' },
    { id: 'productos', label: 'Productos', icon: ShoppingBag, color: 'from-pink-600 to-pink-700' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'checklist':
        return <DailyChecklist />;
      case 'cronograma':
        return <Cronograma />;
      case 'leadscorer':
        return <LeadScorer />;
      case 'guiones':
        return <GuionesObjeciones />;
      case 'productos':
        return <Productos />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">🎀 Alba Brows System</h1>

          {/* HAMBURGER MENU */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                    currentPage === item.id
                      ? 'bg-slate-700 border-l-4 border-l-blue-500'
                      : 'hover:bg-slate-700'
                  } text-slate-200`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden md:block w-64 bg-slate-800 border-r border-slate-700 min-h-screen sticky top-16">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                    currentPage === item.id
                      ? `bg-gradient-to-r ${item.color} text-white font-bold`
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-700 p-3 rounded text-xs text-slate-300">
            <p>💪 Stefany - Setter Alba Brows</p>
            <p className="mt-1">Conectado a Firebase ✅</p>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
