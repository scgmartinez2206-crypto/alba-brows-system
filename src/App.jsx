import React, { useState, useEffect } from 'react';
import { Menu, X, Home, CheckSquare, Calendar, Target, BookMarked, Package, LogOut, Loader, ListTodo, User, Settings } from 'lucide-react';
import authService from './services/authService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DailyChecklist from './components/DailyChecklist';
import Cronograma from './components/Cronograma';
import LeadScorer from './components/LeadScorer';
import GuionesObjeciones from './components/GuionesObjeciones';
import Productos from './components/Productos';
import TaskManager from './components/TaskManager';
import ProfileSettings from './components/ProfileSettings';
import AccountSettings from './components/AccountSettings';
import AIChat from './components/AIChat';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [kpis, setKpis] = useState({});
  const [tasks, setTasks] = useState([]);

  // Cargar KPIs desde localStorage
  useEffect(() => {
    const kpisLocal = JSON.parse(localStorage.getItem('kpis') || '{}');
    setKpis(kpisLocal);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tareas', icon: ListTodo },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'leadscorer', label: 'Lead Scorer', icon: Target },
    { id: 'guiones', label: 'Guiones', icon: BookMarked },
    { id: 'productos', label: 'Productos', icon: Package }
  ];

  // Detectar usuario al cargar
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'tasks':
        return <TaskManager user={user} />;
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
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-light)' }}
      >
        <Loader size={40} style={{ color: 'var(--accent-pink)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // NO AUTENTICADO - MOSTRAR LOGIN
  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  // AUTENTICADO - MOSTRAR APP
  return (
    <div
      style={{ backgroundColor: 'var(--bg-light)' }}
      className="min-h-screen flex flex-col md:flex-row"
    >
      {/* SIDEBAR */}
      <aside
        style={{ backgroundColor: 'var(--primary-dark)' }}
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-56 md:min-h-screen fixed md:sticky md:top-0 z-40 md:z-auto overflow-y-auto`}
      >
        {/* LOGO SECTION */}
        <div className="p-8 border-b" style={{ borderColor: 'rgba(236, 72, 153, 0.1)' }}>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'white' }}>
            ALBA
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--accent-gold)' }}>
            Setter System
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="p-6 space-y-1">
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
                className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200"
                style={{
                  backgroundColor: isActive ? 'var(--accent-pink)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  fontWeight: isActive ? '600' : '400'
                }}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'white' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* USER SECTION */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 border-t space-y-4"
          style={{ borderColor: 'rgba(236, 72, 153, 0.1)', backgroundColor: 'var(--primary-darker)' }}
        >
          <div className="relative">
            <button
              onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
              className="w-full flex items-center gap-3 p-2 rounded-lg transition-all"
              style={{
                backgroundColor: showAvatarDropdown ? 'rgba(236, 72, 153, 0.2)' : 'transparent'
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--accent-pink)' }}
              >
                <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium truncate" style={{ color: 'white' }}>
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Setter
                </p>
              </div>
            </button>

            {/* DROPDOWN */}
            {showAvatarDropdown && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border space-y-1 p-2"
                style={{
                  backgroundColor: 'var(--primary-dark)',
                  borderColor: 'rgba(236, 72, 153, 0.2)'
                }}
              >
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowAvatarDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <User size={14} />
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowAvatarDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <Settings size={14} />
                  Configuración
                </button>
                <div style={{ borderTop: '1px solid rgba(236, 72, 153, 0.2)' }} className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors"
                  style={{
                    color: 'var(--accent-pink)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <LogOut size={14} />
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* TOPBAR */}
        <header
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden transition-colors"
                style={{ color: 'var(--text-dark)' }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden md:block">
                <p
                  style={{ color: 'var(--text-dark)', fontSize: '14px' }}
                  className="font-medium"
                >
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="text-sm" style={{ color: 'var(--text-light)' }}>
              {user?.email}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <ProfileSettings
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <AccountSettings
          user={user}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* AI CHAT */}
      {user && <AIChat user={user} kpis={kpis} tasks={tasks} />}
    </div>
  );
}

export default App;
