import React, { useState } from 'react';
import { Menu, X, Home, CheckCircle, Calendar, Zap, BookOpen, ShoppingBag, Bell, LogOut } from 'lucide-react';
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
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'leadscorer', label: 'Lead Scorer', icon: Zap },
    { id: 'guiones', label: 'Guiones & Scripts', icon: BookOpen },
    { id: 'productos', label: 'Productos', icon: ShoppingBag }
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
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }} className="flex">
      {/* SIDEBAR */}
      <aside style={{ backgroundColor: 'var(--primary-dark)' }} className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 md:min-h-screen fixed md:sticky md:top-0 z-40 md:z-auto`}>
        {/* LOGO */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--primary-darker)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>Alba</h2>
          <p className="text-xs" style={{ color: 'var(--accent-pink)' }}>Beauty & Academy</p>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-pink)' : 'transparent',
                  color: isActive ? 'white' : 'currentColor'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--primary-darker)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-pink)' }}>
              <span style={{ color: 'white' }} className="font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'white' }}>Stefany</p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>Setter Senior</p>
            </div>
          </div>
          <button className="w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--primary-dark)' }}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="border-b" style={{ borderColor: 'var(--border-light)', backgroundColor: 'white' }}>
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                style={{ color: 'var(--text-dark)' }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold hidden md:block" style={{ color: 'var(--text-dark)' }}>
                ¡Buenos días, Stefany! ✨
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:opacity-70 transition" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                <Bell size={20} />
              </button>
              <div className="text-sm text-right hidden md:block">
                <p style={{ color: 'var(--text-dark)' }} className="font-medium">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
