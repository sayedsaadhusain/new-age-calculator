import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { Milestones } from './pages/Milestones';
import { Navbar } from './components/ui/Navbar';
import { useAgeStore } from './stores/useAgeStore';

function App() {
  const { birthDate } = useAgeStore();

  return (
    <Router>
      <div className="bg-background-dark min-h-screen text-white font-sans overflow-x-hidden relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={birthDate ? <Results /> : <Navigate to="/" />} />
          <Route path="/milestones" element={birthDate ? <Milestones /> : <Navigate to="/" />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
