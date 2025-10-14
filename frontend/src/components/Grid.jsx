import React from "react";
import "./Grid.css";
import defaultPieces from './pieces';

// simple starting board representation (8x8)
// each square is either null or a code like 'wP' (white pawn) or 'bK' (black king)
const START = [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'],
];

const Grid = ({ piecesMap }) => {
  const rows = 8;
  const cols = 8;
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
          aria-label={`square ${row + 1}${col + 1}`}
        >
          {code && (
            <img
              src={pieces[code]}
              alt={code}
              className={`piece-img ${code} piece-img-${code} piece-img-${code.toLowerCase()}`}
              draggable={false}
            />
          )}
        </div>
      );
    }
  }

  return <div className="chess-board">{squares}</div>;
};

export default Grid;
