import React, { useState, useEffect } from "react";
import "./Grid.css";
import getMoves, { isInCheck } from "./brain/MoveRules";
import defaultPieces from "./pieces";
import PromotionModal from "./PromotionModal";

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

  const [board, setBoard] = useState(START);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [turn, setTurn] = useState("w");
  const [checkStatus, setCheckStatus] = useState({ w: false, b: false });
  const [promotionModal, setPromotionModal] = useState({ show: false, options: [], row: null, col: null });
  const [timerStarted, setTimerStarted] = useState(false);
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600); // 10 minutes in seconds

  // Timer effect
  useEffect(() => {
    if (!timerStarted || (whiteTime <= 0 || blackTime <= 0)) return;

    const interval = setInterval(() => {
      if (turn === "w") {
        setWhiteTime(prev => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime(prev => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted, turn, whiteTime, blackTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePromotionSelect = (promoteTo) => {
    const { row, col } = promotionModal;
    const newBoard = board.map((r) => [...r]);
    const movingPiece = board[selected.row][selected.col];

    // Apply move
    newBoard[row][col] = movingPiece[0] + promoteTo;
    newBoard[selected.row][selected.col] = null;

    setBoard(newBoard);
    setSelected(null);
    setLegalMoves([]);
    setPromotionModal({ show: false, options: [], row: null, col: null });

    const nextTurn = turn === "w" ? "b" : "w";
    setTurn(nextTurn);

    // Start timer on white's first move
    if (turn === "w" && !timerStarted) {
      setTimerStarted(true);
    }

    setCheckStatus({
      w: isInCheck(newBoard, "w"),
      b: isInCheck(newBoard, "b")
    });
  };

  const handleClick = (row, col) => {
    const piece = board[row][col];

    const isMoveSquare = legalMoves.some(
      (m) => m.row === row && m.col === col
    );

    // --- Perform Move ---
    if (isMoveSquare && selected) {
      const newBoard = board.map((r) => [...r]);

      const move = legalMoves.find((m) => m.row === row && m.col === col);

      let promoteTo = move.promoteTo || null;

      // ⬅️ Promotion logic (if multiple promotion choices exist)
      if (Array.isArray(promoteTo)) {
        // Show promotion modal instead of alert
        setPromotionModal({
          show: true,
          options: promoteTo,
          row,
          col
        });
        return;
      }

      const movingPiece = board[selected.row][selected.col];

      // Apply move
      if (promoteTo) {
        newBoard[row][col] = movingPiece[0] + promoteTo;
      } else {
        newBoard[row][col] = movingPiece;
      }

      newBoard[selected.row][selected.col] = null;

      setBoard(newBoard);
      setSelected(null);
      setLegalMoves([]);

      const nextTurn = turn === "w" ? "b" : "w";
      setTurn(nextTurn);

      // Start timer on white's first move
      if (turn === "w" && !timerStarted) {
        setTimerStarted(true);
      }

      setCheckStatus({
        w: isInCheck(newBoard, "w"),
        b: isInCheck(newBoard, "b")
      });

      return;
    }

    // --- Selecting a piece ---
    if (piece) {
      if (piece[0] !== turn) return;

      const moves = getMoves(board, row, col);

      // Transform promotion array for UI
      moves.forEach(m => {
        if (m.promoteTo && !Array.isArray(m.promoteTo)) {
          m.promoteTo = [m.promoteTo];
        }
      });

      setSelected({ row, col });
      setLegalMoves(moves);
      return;
    }

    setSelected(null);
    setLegalMoves([]);
  };

  return (
    <div className="game-container">
      <div className="timer-section">
        <div className={`timer black-timer ${turn === 'b' && timerStarted ? 'active' : ''}`}>
          <div className="timer-label">Black</div>
          <div className="timer-display">{formatTime(blackTime)}</div>
        </div>
        <div className="game-status">
          {turn === "w" ? "White's Turn" : "Black's Turn"}
          {checkStatus.w && turn === "w" && <div className="check-warning">CHECK!</div>}
          {checkStatus.b && turn === "b" && <div className="check-warning">CHECK!</div>}
        </div>
        <div className={`timer white-timer ${turn === 'w' && timerStarted ? 'active' : ''}`}>
          <div className="timer-label">White</div>
          <div className="timer-display">{formatTime(whiteTime)}</div>
        </div>
      </div>

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

            const isCheckedKing =
              code &&
              code[1] === "K" &&
              checkStatus[code[0]];

            return (
              <div
                key={`${row}-${col}`}
                className={`square 
                  ${isDark ? "dark" : "light"} 
                  ${isSelected ? "selected" : ""} 
                  ${move ? (move.capture ? "capture-square" : "move-square") : ""}
                  ${isCheckedKing ? "checked-king" : ""}
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

      {promotionModal.show && (
        <PromotionModal
          color={turn}
          options={promotionModal.options}
          onSelect={handlePromotionSelect}
          piecesMap={pieces}
        />
      )}
    </div>
  );
};

export default Grid;
