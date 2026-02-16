import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

interface LeaderboardUser {
  _id: string;
  name: string;
  score: number;
  gamesPlayed: number;
}

export default function Leaderboard() {
  const { isAuthenticated } = useAuth0();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<LeaderboardUser[]>('/api/users/leaderboard');
      console.log('Leaderboard data:', data);
      setUsers(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // ยิง API แค่ครั้งเดียวตอนเข้าหน้า
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, []); // empty dependency = run once on mount

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        🏆 Leaderboard
      </h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/10">
              <th className="px-6 py-3 text-left text-white font-semibold">Rank</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Player</th>
              <th className="px-6 py-3 text-center text-white font-semibold">Score</th>
              <th className="px-6 py-3 text-center text-white font-semibold">Games</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-6 py-4 text-white">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                <td className="px-6 py-4 text-center text-white">{user.score}</td>
                <td className="px-6 py-4 text-center text-white/70">
                  {user.gamesPlayed}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/70">
                  No players yet. Be the first to play!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
