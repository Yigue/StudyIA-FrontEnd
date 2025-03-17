import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from './lib/supabase';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import StudyArea from './pages/StudyArea';
import Library from './pages/Library';
import FlashcardsReview from './pages/FlashcardsReview';
import Auth from './pages/Auth';
import Settings from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show auth screen if no session
  if (!session) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'study':
        return <StudyArea />;
      case 'library':
        return <Library />;
      case 'flashcards':
        return <FlashcardsReview />;
      case 'search':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Buscar</h2>
            <p className="text-gray-600">Función de búsqueda en desarrollo...</p>
          </div>
        );
      case 'progress':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Progreso</h2>
            <p className="text-gray-600">Seguimiento de progreso en desarrollo...</p>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;