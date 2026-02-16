import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  const handleLogin = async () => {
    console.log('Login clicked');
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white text-xl font-bold">
            🎮 Tic-Tac-Toe
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/game"
                  className="text-white/80 hover:text-white transition"
                >
                  Play
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-white/80 hover:text-white transition"
                >
                  Leaderboard
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white text-sm">{user?.name}</span>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
