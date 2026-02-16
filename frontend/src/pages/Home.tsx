import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-bold text-white mb-6">
        Tic-Tac-Toe
      </h1>
      <p className="text-white/80 text-xl mb-8 max-w-md">
        Challenge our AI bot and climb the leaderboard! Win games to earn points
        and compete with other players.
      </p>

      <div className="space-y-4">
        {isAuthenticated ? (
          <Link
            to="/game"
            className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-lg text-xl hover:bg-gray-100 transition transform hover:scale-105"
          >
            🎮 Start Playing
          </Link>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-white text-purple-600 font-bold px-8 py-4 rounded-lg text-xl hover:bg-gray-100 transition transform hover:scale-105"
          >
            🔐 Login to Play
          </button>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="text-white font-semibold mb-2">Score System</h3>
          <p className="text-white/70 text-sm">
            Win: +1 point<br />
            Lose: -1 point<br />
            3 wins in a row: +1 bonus!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="text-white font-semibold mb-2">Smart AI</h3>
          <p className="text-white/70 text-sm">
            Our bot adapts to your moves. Can you outsmart it?
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-white font-semibold mb-2">Leaderboard</h3>
          <p className="text-white/70 text-sm">
            Compete with other players and reach the top!
          </p>
        </div>
      </div>
    </div>
  );
}
