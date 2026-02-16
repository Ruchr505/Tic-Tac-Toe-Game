interface BoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export default function Board({ board, onCellClick, disabled }: BoardProps) {
  return (
    <div className="game-board">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`game-cell bg-white/20 rounded-lg ${cell?.toLowerCase() || ''} ${
            disabled || cell ? 'disabled cursor-not-allowed' : ''
          }`}
          onClick={() => !disabled && !cell && onCellClick(index)}
          disabled={disabled || !!cell}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}
