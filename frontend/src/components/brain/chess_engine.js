import getMoves, { isInCheck, isCheckmate, makeMove } from "./MoveRules.js";

const initial_board = [
  ["bR", "bN", "bB", "bQ", "bK"],
  ["bP", "bP", "bP", "bP", "bP"],
  [null, null, null, null, null],
  [null, null, null, null, null],
  ["wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK"]
];

/*

// Approximate move calculations for Chess Attack
// Average branching factor ~15-20 moves per position

Depth 1:   ~20 positions evaluated
Depth 2:  ~400 positions
Depth 3:  ~8,000 positions
Depth 4:  ~160,000 positions
Depth 5:  ~3,200,000 positions
Depth 6:  ~64,000,000 positions  ⚠️ SLOW
Depth 7:  ~1,280,000,000 positions  ⚠️ VERY SLOW

*/ 
function cloneBoard(board) {
    const newBoard = board.map(row => [...row]);
    return newBoard;
}

export default function getLegalMoves(board, turn) {
  const legalMoves = [];

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {

      const piece = board[r][c];
      if (! piece) continue;
      if (piece[0] !== turn) continue;

      // getMoves returns:  { row, col, capture, promoteTo }
      const moves = getMoves(board, r, c);

      for (const m of moves) {
        const promotionPieces = Array.isArray(m.promoteTo) 
          ? m.promoteTo 
          : (m.promoteTo ? [m. promoteTo] : [null]);

        for (const promoteTo of promotionPieces) {
          const moveObj = {
            from: { r, c },
            to: { r: m.row, c: m.col },
            piece,
            captured: m.capture ?  board[m.row][m.col] : null,
            promoteTo:  promoteTo || null
          };

          const newBoard = makeMove(
            board,
            r,
            c,
            m.row,
            m.col,
            promoteTo
          );

          if (! isInCheck(newBoard, turn)) {
            legalMoves.push(moveObj);
          }
        }
      }
    }
  }

  return legalMoves;
}

/*
example object of each move
{
  from: { r:  5, c: 0 },      // original square
  to:    { r: 4, c: 0 },      // destination square
  piece: "wP",               // moving piece
  captured: null,            // or "bN", "bP", etc. 
  promoteTo: null            // or "Q", "N", or an array for special rules
}
*/

/**
 * Check if the game is over for a given player
 * @param {Array} board - Current board state
 * @param {string} player - 'w' or 'b'
 * @returns {boolean} - True if game is over (checkmate or stalemate)
 */
export function isGameOver(board, player) {
    const legalMoves = getLegalMoves(board, player);
    return legalMoves.length === 0;
}

/**
 * Evaluate the game result
 * @param {Array} board - Current board state
 * @param {string} player - Current player ('w' or 'b')
 * @returns {Object} - { over: boolean, winner: 'w'|'b'|'draw'|null }
 */
export function evaluateGameResult(board, player) {
    const legalMoves = getLegalMoves(board, player);
    
    if (legalMoves.length === 0) {
        if (isInCheck(board, player)) {
            return {
                over: true,
                winner: player === 'w' ? 'b' : 'w',
                reason: 'checkmate'
            };
        } else {
            return {
                over: true,
                winner: 'draw',
                reason: 'stalemate'
            };
        }
    }
    
    return {
        over: false,
        winner: null,
        reason: null
    };
}

/**
 * Evaluate board position from white's perspective
 * Positive score = good for white, Negative = good for black
 * @param {Array} board - Current board state
 * @returns {number} - Board evaluation score
 */
export function evaluateBoard(board) {
    const pieceValues = {
        'P': 100,   
        'N': 320,   
        'B': 330,   
        'R': 500,   
        'Q': 900,   
        'K': 20000  
    };

    const pawnTable = [
        [0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50],
        [10, 10, 20, 20, 10],
        [5,  5, 10, 15,  5],
        [0,  0,  0, 10,  0],
        [0,  0,  0,  0,  0]
    ];

    const knightTable = [
        [-50, -40, -30, -40, -50],
        [-40, -20,  0,  -20, -40],
        [-30,  0,  10,   0, -30],
        [-30,  5,  10,   5, -30],
        [-40, -20,  0, -20, -40],
        [-50, -40, -30, -40, -50]
    ];

    const bishopTable = [
        [-20, -10, -10, -10, -20],
        [-10,  0,   0,   0, -10],
        [-10,  0,   5,   0, -10],
        [-10,  5,   5,   5, -10],
        [-10,  0,   5,   0, -10],
        [-20, -10, -10, -10, -20]
    ];

    const kingTable = [
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-30, -40, -40, -40, -30],
        [-20, -30, -30, -30, -20],
        [-10, -20, -20, -20, -10]
    ];

    let score = 0;

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            const piece = board[r][c];
            if (! piece) continue;

            const color = piece[0];
            const type = piece[1];
            const multiplier = color === 'w' ? 1 : -1;

            score += pieceValues[type] * multiplier;

            let positionBonus = 0;
            const row = color === 'w' ? r : (5 - r);

            switch(type) {
                case 'P':
                    positionBonus = pawnTable[row][c];
                    break;
                case 'N':
                    positionBonus = knightTable[row][c];
                    break;
                case 'B':
                    positionBonus = bishopTable[row][c];
                    break;
                case 'K':
                    positionBonus = kingTable[row][c];
                    break;
            }

            score += positionBonus * multiplier;
        }
    }

    return score;
}

/**
 * Find the best move for the current player using minimax with alpha-beta pruning
 * @param {Array} board - Current board state
 * @param {number} depth - Search depth
 * @param {string} player - 'w' or 'b'
 * @returns {Object|null} - Best move object or null if no moves available
 */
export function findBestMove(board, depth, player) {
    const legalMoves = getLegalMoves(board, player);
    
    if (legalMoves. length === 0) {
        return null;
    }

    let bestMove = null;
    let bestScore = player === 'w' ? -Infinity :  Infinity;

    for (const move of legalMoves) {
        const newBoard = makeMove(
            board,
            move.from.r,
            move.from.c,
            move.to.r,
            move.to.c,
            move.promoteTo
        );

        const score = minimax(
            newBoard,
            depth - 1,
            -Infinity,
            Infinity,
            player === 'w' ? false : true 
        );

        if (player === 'w') {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

/**
 * Minimax algorithm with alpha-beta pruning
 * @param {Array} board - Current board state
 * @param {number} depth - Remaining search depth
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @param {boolean} maximizingPlayer - True if maximizing (white), false if minimizing (black)
 * @returns {number} - Board evaluation score
 */
export function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const currentPlayer = maximizingPlayer ? 'w' : 'b';
    
    if (depth === 0) {
        return evaluateBoard(board);
    }

    const result = evaluateGameResult(board, currentPlayer);
    if (result.over) {
        if (result.winner === 'w') {
            return 100000 + depth; // Prefer faster checkmate
        } else if (result.winner === 'b') {
            return -100000 - depth; // Prefer faster checkmate
        } else {
            return 0; // Stalemate
        }
    }

    const legalMoves = getLegalMoves(board, currentPlayer);

    if (maximizingPlayer) {
        let maxEval = -Infinity;

        for (const move of legalMoves) {
            const newBoard = makeMove(
                board,
                move.from.r,
                move.from.c,
                move.to.r,
                move.to.c,
                move.promoteTo
            );

            const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);

            if (beta <= alpha) {
                break;
            }
        }

        return maxEval;
    } else {
        let minEval = Infinity;

        for (const move of legalMoves) {
            const newBoard = makeMove(
                board,
                move.from. r,
                move.from. c,
                move.to. r,
                move.to. c,
                move.promoteTo
            );

            const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);

            if (beta <= alpha) {
                break; 
            }
        }

        return minEval;
    }
}

// Export all functions
export { initial_board, cloneBoard };