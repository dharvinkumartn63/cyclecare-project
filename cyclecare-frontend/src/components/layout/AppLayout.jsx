import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarHeart, TrendingUp, History,
  Droplets, User, Settings, LogOut, Moon, Sun, Menu, X, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/dateUtils';
import FeedbackModal from '../ui/FeedbackModal';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracker',   icon: CalendarHeart,   label: 'Tracker' },
  { to: '/prediction',icon: TrendingUp,       label: 'Prediction' },
  { to: '/hydration', icon: Droplets,         label: 'Hydration' },
  { to: '/history',   icon: History,          label: 'History' },
  { to: '/profile',   icon: User,             label: 'Profile' },
];

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = ({ onOpenFeedback }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 px-4 py-6 gap-6 fixed top-0 left-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-2">
        <img src="/women.png" alt="CycleCare" className="w-9 h-9 object-contain" />
        <div>
          <h1 className="font-extrabold text-lg text-primary-600 dark:text-primary-400 leading-tight">CycleCare</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Wellness Tracker</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800 pt-4">
        <button
          onClick={onOpenFeedback}
          className="sidebar-link w-full text-left text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          <MessageSquare className="w-5 h-5" /><span>Report Issue / Feedback</span>
        </button>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Settings className="w-5 h-5" /><span>Settings</span>
        </NavLink>
        <button
          onClick={toggleTheme}
          className="sidebar-link w-full text-left"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" /><span>Logout</span>
        </button>
      </div>

      {/* User mini-profile */}
      <div className="flex items-center gap-3 px-3 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-primary-300" />
        ) : (
          <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(user?.name)}
          </div>
        )}
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.userId}</p>
        </div>
      </div>
    </aside>
  );
};

export const MobileNav = ({ onOpenFeedback }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/women.png" alt="CycleCare" className="w-7 h-7 object-contain" />
          <span className="font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle theme">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMenuOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Bottom nav tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-2 h-16">
        {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="w-72 bg-white dark:bg-gray-900 h-full flex flex-col p-5 gap-4 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src="/women.png" alt="CycleCare" className="w-8 h-8 object-contain" />
                <span className="font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex flex-col gap-1">
              <button onClick={() => { setMenuOpen(false); onOpenFeedback(); }} className="sidebar-link w-full text-left text-primary-600 dark:text-primary-400">
                <MessageSquare className="w-5 h-5" /><span>Report Issue / Feedback</span>
              </button>
              <NavLink to="/settings" onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Settings className="w-5 h-5" /><span>Settings</span>
              </NavLink>
              <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                <LogOut className="w-5 h-5" /><span>Logout</span>
              </button>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.userId}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AppLayout = ({ children }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar onOpenFeedback={() => setShowFeedbackModal(true)} />
      <MobileNav onOpenFeedback={() => setShowFeedbackModal(true)} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8 animate-fade-in">
          {children}
        </div>
      </main>
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  );
};

export default AppLayout;
