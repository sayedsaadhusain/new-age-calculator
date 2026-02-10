import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { Milestones } from './pages/Milestones';
import { Friends } from './pages/Friends';
import { Navbar } from './components/ui/Navbar';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { useAgeStore } from './stores/useAgeStore';
import { RefreshCw } from 'lucide-react';

function App() {
  const { birthDate } = useAgeStore();
  const [isLoading, setIsLoading] = useState(true);

  // PWA Update handling
  // PWA Update handling
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    // Simulate initial loading for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="bg-background-dark min-h-screen text-white font-sans overflow-x-hidden relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={birthDate ? <Results /> : <Navigate to="/" />} />
          <Route path="/milestones" element={birthDate ? <Milestones /> : <Navigate to="/" />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
        <Navbar />

        {/* PWA Update Toast */}
        {needRefresh && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-blue-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <span className="text-sm font-medium">New version available</span>
            <button
              onClick={() => updateServiceWorker(true)}
              className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
