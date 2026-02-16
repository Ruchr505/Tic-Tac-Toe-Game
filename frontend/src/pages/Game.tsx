import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Board from '../components/Board';
import { useApi } from '../hooks/useApi';

interface GameState {
  _id: string;
  board: (string | null)[];
  status: string;
  winner?: string;
  currentTurn: string;
}

export default function Game() {
  const { isAuthenticated } = useAuth0();
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const startNewGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newGame = await api.post<GameState>('/api/game/new');
      setGame(newGame);
    } catch (err) {
      setError('Failed to start a new game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const makeMove = useCallback(
    async (position: number) => {
      if (!game || game.status !== 'in_progress') return;

      setLoading(true);
      setError(null);
      try {
        const updatedGame = await api.post<GameState>(`/api/game/${game._id}/move`, {
          position,
        });
        setGame(updatedGame);
      } catch (err) {
        setError('Failed to make move');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [game, api]
  );

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const getStatusMessage = () => {
    if (!game) return '';
    switch (game.status) {
      case 'player_won':
        return '🎉 You won! +1 point';
      case 'bot_won':
        return '😢 Bot wins! -1 point';
      case 'draw':
        return "🤝 It's a draw!";
      default:
        return game.currentTurn === 'X' ? 'Your turn (X)' : "Bot's turn (O)";
    }
  };

  const isGameOver = game?.status && game.status !== 'in_progress';

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Play Tic-Tac-Toe</h1>

      {error && (
        <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {!game ? (
        <button
          onClick={startNewGame}
          disabled={loading}
          className="bg-white text-purple-600 font-bold px-8 py-4 rounded-lg text-xl hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? 'Starting...' : '🎮 Start New Game'}
        </button>
      ) : (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl">
          <div className="text-center mb-6">
            <p
              className={`text-xl font-semibold ${
                game.status === 'player_won'
                  ? 'text-green-400'
                  : game.status === 'bot_won'
                  ? 'text-red-400'
                  : 'text-white'
              }`}
            >
              {getStatusMessage()}
            </p>
          </div>

          <Board
            board={game.board}
            onCellClick={makeMove}
            disabled={loading || isGameOver || game.currentTurn !== 'X'}
          />

          {isGameOver && (
            <button
              onClick={startNewGame}
              disabled={loading}
              className="mt-6 w-full bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Play Again'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
