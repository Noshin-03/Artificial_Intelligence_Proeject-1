import React from "react";
import "./Grid.css";
import defaultPieces from './pieces';

// simple starting board representation (8x8)
// each square is either null or a code like 'wP' (white pawn) or 'bK' (black king)

// this board is for regular chess
// const START = [
//   ['bR','bN','bB','bQ','bK','bB','bN','bR'],
//   ['bP','bP','bP','bP','bP','bP','bP','bP'],
//   [null,null,null,null,null,null,null,null],
//   [null,null,null,null,null,null,null,null],
//   [null,null,null,null,null,null,null,null],
//   [null,null,null,null,null,null,null,null],
//   ['wP','wP','wP','wP','wP','wP','wP','wP'],
//   ['wR','wN','wB','wQ','wK','wB','wN','wR'],
// ];

// Chess Attack 5x6 mini chess board
const START = [
  ['bR','bN','bB','bQ','bK'],
  ['bP','bP','bP','bP','bP'],
  [null,null,null,null,null],
  [null,null,null,null,null],
  ['wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK'],
];

const Grid = ({ piecesMap }) => {
  const rows = 6;
  const cols = 5;
  const pieces = piecesMap || defaultPieces;

  const squares = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isDark = (row + col) % 2 === 1;
      const code = START[row][col];
      squares.push(
        <div
          key={`${row}-${col}`}
          className={`square ${isDark ? "dark" : "light"}`}
          role="button"
          aria-label={`square ${row + 1}-${col + 1}`}
        >
          {code && (
            <img
              src={pieces[code]}
              alt={code}
              className={`piece-img ${code}`}
              draggable={false}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div
      className="chess-board"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {squares}
    </div>
  );
};

export default Grid;
