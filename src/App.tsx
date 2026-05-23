import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import BookRide from './pages/BookRide';
import RideHistory from './pages/RideHistory';
import Profile from './pages/Profile';

type Page = 'home' | 'book' | 'rides' | 'profile';

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({ open: false, mode: 'login' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ open: true, mode });
  };

  const navigateTo = (p: string) => {
    if ((p === 'book' || p === 'rides' || p === 'profile') && !user) {
      openAuth('login');
      return;
    }
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    setPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading EcoRide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onAuthClick={openAuth}
        currentPage={page}
        onNavigate={navigateTo}
        scrolled={scrolled}
      />

      <main>
        {page === 'home' && (
          <LandingPage
            onBook={() => navigateTo('book')}
            onAuth={openAuth}
            isLoggedIn={!!user}
          />
        )}
        {page === 'book' && (
          <BookRide onAuthRequired={() => openAuth('login')} />
        )}
        {page === 'rides' && (
          <RideHistory onBook={() => navigateTo('book')} />
        )}
        {page === 'profile' && (
          <Profile onSignOut={handleSignOut} />
        )}
      </main>

      {authModal.open && (
        <AuthModal
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          defaultMode={authModal.mode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
