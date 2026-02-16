import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Loading from './components/Loading';
import { useProfileSync } from './hooks/useProfileSync';

function App() {
  const { isLoading } = useAuth0();

  // Sync profile name จาก Auth0 ไปยัง backend
  useProfileSync();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
