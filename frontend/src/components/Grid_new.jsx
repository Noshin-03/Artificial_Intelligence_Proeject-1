import React, { useState, useEffect } from "react";
import "./Grid.css";
import getMoves, { isInCheck } from "./brain/MoveRules";
import defaultPieces from "./pieces";
import PromotionModal from "./PromotionModal";
import { findBestMove } from "./brain/chess_engine";

//TODO: vobissoter kotha
//TODO: highlight previous move
//TODO: remove timer when playing with ai
//TODO: add container for captured pieces

//TODO: game ending condition upgrade

const START = [
  ["bR", "bN", "bB", "bQ", "bK"],
  ["bP", "bP", "bP", "bP", "bP"],
  [null, null, null, null, null],
  [null, null, null, null, null],
  ["wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK"]
];

const Grid = ({ piecesMap, mode = "hvh", botColor = "b", difficulty = "medium", onNewGame, darkMode = true }) => {
  const pieces = piecesMap || defaultPieces;
  const depthMap = { easy: 4, medium: 5, hard: 6 };
  const botDepth = depthMap[difficulty] || 3;

  const [board, setBoard] = useState(START);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [turn, setTurn] = useState("w");
  const [checkStatus, setCheckStatus] = useState({ w: false, b: false });
  const [promotionModal, setPromotionModal] = useState({ show: false, options: [], row: null, col: null });
  const [timerStarted, setTimerStarted] = useState(false);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  // Bot move effect
  useEffect(() => {
    if (mode !== "hvb") return;
    if (turn !== botColor) return;
    if (promotionModal.show) return;

    const t = setTimeout(() => {
      const best = findBestMove(board, botDepth, botColor);
      if (!best) return;

      const newBoard = board.map(r => [...r]);
      const movingPiece = board[best.from.r][best.from.c];
      const promoteTo = best.promoteTo || null;
      newBoard[best.from.r][best.from.c] = null;
      newBoard[best.to.r][best.to.c] = promoteTo ? movingPiece[0] + promoteTo : movingPiece;

      setBoard(newBoard);
      setSelected(null);
      setLegalMoves([]);
      const nextTurn = turn === "w" ? "b" : "w";
      setTurn(nextTurn);

      if (turn === "w" && !timerStarted) {
        setTimerStarted(true);
      }

      setCheckStatus({
        w: isInCheck(newBoard, "w"),
        b: isInCheck(newBoard, "b")
      });
    }, 500);
    return () => clearTimeout(t);
  }, [mode, botColor, botDepth, turn, board, promotionModal.show]);

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

    newBoard[row][col] = movingPiece[0] + promoteTo;
    newBoard[selected.row][selected.col] = null;

    setBoard(newBoard);
    setSelected(null);
    setLegalMoves([]);
    setPromotionModal({ show: false, options: [], row: null, col: null });

    const nextTurn = turn === "w" ? "b" : "w";
    setTurn(nextTurn);

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
    const isMoveSquare = legalMoves.some((m) => m.row === row && m.col === col);

    if (isMoveSquare && selected) {
      const newBoard = board.map((r) => [...r]);
      const move = legalMoves.find((m) => m.row === row && m.col === col);
      let promoteTo = move.promoteTo || null;

      if (Array.isArray(promoteTo)) {
        setPromotionModal({
          show: true,
          options: promoteTo,
          row,
          col
        });
        return;
      }

      const movingPiece = board[selected.row][selected.col];

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

      if (turn === "w" && !timerStarted) {
        setTimerStarted(true);
      }

      setCheckStatus({
        w: isInCheck(newBoard, "w"),
        b: isInCheck(newBoard, "b")
      });

      return;
    }

    if (piece) {
      if (piece[0] !== turn) return;
      if (mode === "hvb" && piece[0] === botColor) return;

      const moves = getMoves(board, row, col);
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
      <div className="controls-section">
        <button 
          onClick={onNewGame}
          style={{
            backgroundColor: '#22C55E',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#16a34a';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#22C55E';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
          }}
        >
          ← Back to Menu
        </button>
      </div>

      <div className="timer-section">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          border: `2px solid ${turn === 'b' ? '#22C55E' : '#ccc'}`,
          borderRadius: '8px',
          backgroundColor: turn === 'b' ? '#e8f5e9' : '#f5f5f5',
          minWidth: '120px',
          transition: 'all 0.3s ease',
          boxShadow: turn === 'b' ? '0 0 12px rgba(34, 197, 94, 0.3)' : 'none'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>Black</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatTime(blackTime)}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            {turn === "w" ? "⚪ White's Turn" : "⚫ Black's Turn"}
          </div>
          {(checkStatus.w || checkStatus.b) && (
            <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '16px', animation: 'pulse 1s infinite' }}>
              ⚠️ CHECK!
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          border: `2px solid ${turn === 'w' ? '#22C55E' : '#ccc'}`,
          borderRadius: '8px',
          backgroundColor: turn === 'w' ? '#e8f5e9' : '#f5f5f5',
          minWidth: '120px',
          transition: 'all 0.3s ease',
          boxShadow: turn === 'w' ? '0 0 12px rgba(34, 197, 94, 0.3)' : 'none'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>White</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatTime(whiteTime)}</div>
        </div>
      </div>

      <div className="chess-board">
        {board.map((rowArr, row) =>
          rowArr.map((code, col) => {
            const isDark = (row + col) % 2 === 1;
            const isSelected = selected && selected.row === row && selected.col === col;
            const move = legalMoves.find((m) => m.row === row && m.col === col);
            const isCheckedKing = code && code[1] === "K" && checkStatus[code[0]];

            let squareStyle = {
              backgroundColor: isDark ? '#0F172A' : '#E8D5B7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              position: 'relative',
              userSelect: 'none'
            };

            if (isSelected) {
              squareStyle.boxShadow = 'inset 0 0 0 4px #3B82F6';
              squareStyle.backgroundColor = isDark ? '#1a2d4a' : '#f0e6d2';
            }

            if (move && move.capture) {
              squareStyle.boxShadow = 'inset 0 0 0 4px #EF4444';
            } else if (move && !move.capture) {
              squareStyle.backgroundColor = isDark ? '#1a4d2e' : '#d4e8d4';
            }

            if (isCheckedKing) {
              squareStyle.boxShadow = 'inset 0 0 0 4px #EF4444';
              squareStyle.animation = 'pulse 1s infinite';
            }

            return (
              <div
                key={`${row}-${col}`}
                style={squareStyle}
                onClick={() => handleClick(row, col)}
              >
                {code && (
                  <img
                    src={pieces[code]}
                    alt={code}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '4px',
                      userSelect: 'none',
                      transition: 'transform 0.2s ease'
                    }}
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
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Grid;
