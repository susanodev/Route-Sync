import { useState, useRef, useEffect } from 'react';
import { Zap, Menu, X, User, LogOut, History, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  onAuthClick: (mode?: 'login' | 'register') => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  scrolled: boolean;
};

export default function Navbar({ onAuthClick, currentPage, onNavigate, scrolled }: Props) {
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Book Ride', page: 'book' },
    { label: 'My Rides', page: 'rides' },
  ];

  const isLanding = currentPage === 'home';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled || !isLanding
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${
              scrolled || !isLanding ? 'text-gray-900' : 'text-white'
            }`}>
              Eco<span className="text-emerald-500">Ride</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? 'bg-emerald-50 text-emerald-600'
                    : scrolled || !isLanding
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
                    scrolled || !isLanding
                      ? 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('profile'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Profile
                    </button>
                    <button
                      onClick={() => { onNavigate('rides'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <History className="w-4 h-4 text-gray-400" /> My Rides
                    </button>
                    <div className="border-t border-gray-50 mt-1">
                      <button
                        onClick={() => { signOut(); setDropdownOpen(false); onNavigate('home'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAuthClick('login')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled || !isLanding
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              scrolled || !isLanding
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.page === 'home' && <MapPin className="w-4 h-4" />}
                {link.page === 'book' && <Zap className="w-4 h-4" />}
                {link.page === 'rides' && <History className="w-4 h-4" />}
                {link.label}
              </button>
            ))}
          </div>
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { onNavigate('profile'); setMobileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); onNavigate('home'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { onAuthClick('login'); setMobileOpen(false); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onAuthClick('register'); setMobileOpen(false); }}
                  className="flex-1 py-2.5 bg-emerald-500 rounded-xl text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
