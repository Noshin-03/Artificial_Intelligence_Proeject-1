const inside = (r, c) => r >= 0 && r < 6 && c >= 0 && c < 5;

function findKing(board, color) {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      if (board[r][c] === color + "K") {
        return [r, c];
      }
    }
  }
  return null;
}

function makeMove(board, r1, c1, r2, c2, promoteTo = null) {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[r1][c1];

  newBoard[r1][c1] = null;

  if (promoteTo) {
    newBoard[r2][c2] = piece[0] + promoteTo;
  } else {
    newBoard[r2][c2] = piece;
  }

  return newBoard;
}

function isInCheck(board, color) {
  const enemy = color === "w" ? "b" : "w";
  const kingPos = findKing(board, color);
  if (!kingPos) return true; 

  const [kr, kc] = kingPos;

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const p = board[r][c];
      if (p && p[0] === enemy) {
        const moves = getMoves(board, r, c, { skipCheckFilter: true });
        for (let m of moves) {
          if (m.row === kr && m.col === kc) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function isCheckmate(board, color) {
  if (!isInCheck(board, color)) return false;

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const p = board[r][c];
      if (p && p[0] === color) {
        const moves = getMoves(board, r, c);
        for (let m of moves) {
          
          const promotionPieces = Array.isArray(m.promoteTo) ? m.promoteTo : (m.promoteTo ? [m.promoteTo] : [null]);
          
          for (let promoteTo of promotionPieces) {
            const newBoard = makeMove(board, r, c, m.row, m.col, promoteTo);
            if (!isInCheck(newBoard, color)) {
              return false; 
            }
          }
        }
      }
    }
  }
  return true;
}


export default function getMoves(board, row, col, options = {}) {
  const piece = board[row][col];
  if (!piece) return [];

  const skipCheckFilter = options.skipCheckFilter || false;

  const color = piece[0];
  const type = piece[1];
  const direction = color === "w" ? -1 : 1;
  const moves = [];

  
  const captured = {
    w: [],
    b: []
  };

  const allPieces = ["N", "R", "B", "Q"];
  const startingCounts = { N:1, R:1, B:1, Q:1, P:5 };
  let currentCount = { w: {N:0,R:0,B:0,Q:0,P:0}, b: {N:0,R:0,B:0,Q:0,P:0} };

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const p = board[r][c];
      if (!p) continue;
      const pieceType = p[1];
      if (pieceType !== 'K') {
        currentCount[p[0]][pieceType]++;
      }
    }
  }
  
  for (let clr of ["w", "b"]) {
    const enemyColor = clr === "w" ? "b" : "w";
    for (let t of allPieces) {
      
      if (currentCount[enemyColor][t] < startingCounts[t]) {
        captured[clr].push(t);
      }
    }
  }

  const pushMove = (r, c, promoteTo = null) => {
    if (!inside(r, c)) return;

    const target = board[r][c];

    if (target && target[0] === color) return;

    moves.push({
      row: r,
      col: c,
      capture: !!target,
      promoteTo
    });
  };

  const addPawnMove = (r, c) => {
    const isPromoRank = (color === "w" && r === 0) || (color === "b" && r === 5);

    
    
    if (isPromoRank) {
      return; 
    }
    
    pushMove(r, c);
  };

  const addPawnAttack = (r, c) => {
    if (!inside(r, c)) return;

    const target = board[r][c];

    if (target && target[0] === color) return;

    const isPromoRank = (color === "w" && r === 0) || (color === "b" && r === 5);

    if (isPromoRank && target) {
      // Chess Attack Rule: Pawn can ONLY promote by CAPTURING on the last rank
      // And ONLY if pieces have been captured
      if (captured[color].length > 0) {
        // Add a single move with all promotion options as an array
        moves.push({
          row: r,
          col: c,
          capture: true,
          promoteTo: captured[color] // Array of available promotion pieces
        });
      } else {
        // No captured pieces available - pawn still can't move to last rank
        return;
      }
    } else if (target) {
      // Pawn can capture (not on promotion rank)
      moves.push({
        row: r,
        col: c,
        capture: true,
        promoteTo: null
      });
    } else if (skipCheckFilter) {
      // For check detection, include empty diagonal squares
      moves.push({
        row: r,
        col: c,
        capture: false,
        promoteTo: null
      });
    }
  };

    
  if (type === "P") {
    const fr = row + direction;

    if (inside(fr, col) && board[fr][col] === null) {
      addPawnMove(fr, col);
    }

    for (let dc of [-1, 1]) {
      const cr = row + direction;
      const cc = col + dc;
      addPawnAttack(cr, cc);
    }
  }

    
  if (type === "N") {
    const jumps = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    jumps.forEach(([dr, dc]) => pushMove(row + dr, col + dc));
  }

    
  const slide = (directions) => {
    for (let [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (inside(r, c)) {
        const target = board[r][c];
        if (target && target[0] === color) break;

        pushMove(r, c);

        if (target) break;

        r += dr;
        c += dc;
      }
    }
  };

  if (type === "R") {
    slide([[1,0], [-1,0], [0,1], [0,-1]]);
  }

  if (type === "B") {
    slide([[1,1], [1,-1], [-1,1], [-1,-1]]);
  }

  if (type === "Q") {
    slide([
      [1,0], [-1,0], [0,1], [0,-1],
      [1,1], [1,-1], [-1,1], [-1,-1]
    ]);
  }

    
  if (type === "K") {
    [
      [1,0], [-1,0], [0,1], [0,-1],
      [1,1], [1,-1], [-1,1], [-1,-1]
    ].forEach(([dr, dc]) => pushMove(row + dr, col + dc));
  }

    
  if (!skipCheckFilter) {
    return moves.filter(m => {
      const newBoard = makeMove(board, row, col, m.row, m.col, m.promoteTo);
      return !isInCheck(newBoard, color);
    });
  }

  return moves;
}

export { isInCheck, isCheckmate, makeMove };
