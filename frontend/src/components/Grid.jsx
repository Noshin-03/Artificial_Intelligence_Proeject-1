import React, { useState } from "react";
import "./Grid.css";
import getMoves from "./MoveRules";
import defaultPieces from "./pieces";

const START = [
  ["bR", "bN", "bB", "bQ", "bK"],
  ["bP", "bP", "bP", "bP", "bP"],
  [null, null, null, null, null],
  [null, null, null, null, null],
  ["wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK"]
];

const Grid = ({ piecesMap }) => {
  const pieces = piecesMap || defaultPieces;

  // ✅ ALL state must be inside the component:
  const [board, setBoard] = useState(START);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [turn, setTurn] = useState("w"); // FIXED

  const handleClick = (row, col) => {
    const piece = board[row][col];

    const isMoveSquare = legalMoves.some(
      (m) => m.row === row && m.col === col
    );

    // 1. Move piece if clicked on a legal move
    if (isMoveSquare && selected) {
      const newBoard = board.map((r) => [...r]);

      newBoard[row][col] = board[selected.row][selected.col];
      newBoard[selected.row][selected.col] = null;

      setBoard(newBoard);
      setSelected(null);
      setLegalMoves([]);

      // Switch turn after a valid move
      setTurn(turn === "w" ? "b" : "w");

      return;
    }

    // 2. Selecting a piece (only if it's your turn)
    if (piece) {
      if (piece[0] !== turn) {
        return; // Prevent selecting opponent pieces
      }

      setSelected({ row, col });
      setLegalMoves(getMoves(board, row, col));
      return;
    }

    // 3. Clicked empty square but not a valid move
    setSelected(null);
    setLegalMoves([]);
  };

  return (
    <div
      className="chess-board"
      style={{
        gridTemplateRows: `repeat(6, 1fr)`,
        gridTemplateColumns: `repeat(5, 1fr)`
      }}
    >
      {board.map((rowArr, row) =>
        rowArr.map((code, col) => {
          const isDark = (row + col) % 2 === 1;

          const isSelected =
            selected && selected.row === row && selected.col === col;

          const move = legalMoves.find(
            (m) => m.row === row && m.col === col
          );

          return (
            <div
              key={`${row}-${col}`}
              className={`square 
                ${isDark ? "dark" : "light"} 
                ${isSelected ? "selected" : ""} 
                ${move ? (move.capture ? "capture-square" : "move-square") : ""}
              `}
              onClick={() => handleClick(row, col)}
            >
              {code && (
                <img
                  src={pieces[code]}
                  alt={code}
                  className="piece-img"
                  draggable={false}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;
