//TODO: add logic for pawn upgrade
//TODO: add logic for check and checkmate (game ending)
//TODO: add logic for game draw


const inside = (r, c) => r >= 0 && r < 6 && c >= 0 && c < 5;

export default function getMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];

  const color = piece[0];
  const type = piece[1];
  const direction = color === "w" ? -1 : 1;
  const moves = [];

  const pushMove = (r, c) => {
  if (!inside(r, c)) return;

  const target = board[r][c];

  // Friendly piece → NOT allowed
  if (target && target[0] === color) return;

  // Empty → normal move
  if (!target) {
    moves.push({
      row: r,
      col: c,
      capture: false
    });
    return;
  }

  // Opponent → capture
  moves.push({
    row: r,
    col: c,
    capture: true
  });
};


  // Pawn
  if (type === "P") {
    // Forward
    const fr = row + direction;
    if (inside(fr, col) && board[fr][col] === null) {
      pushMove(fr, col);
    }

    // Captures
    for (let dc of [-1, 1]) {
      const cr = row + direction;
      const cc = col + dc;
      if (
        inside(cr, cc) &&
        board[cr][cc] &&
        board[cr][cc][0] !== color
      ) {
        pushMove(cr, cc);
      }
    }
  }

  // Knight
  if (type === "N") {
    const jumps = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    jumps.forEach(([dr, dc]) => {
      pushMove(row + dr, col + dc);
    });
  }

  // Rook / Bishop / Queen shared direction logic
  const slide = (directions) => {
  for (let [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;

    while (inside(r, c)) {
      const target = board[r][c];

      // STOP if friendly piece
      if (target && target[0] === color) break;

      // Add move (capture if opponent)
      moves.push({
        row: r,
        col: c,
        capture: target && target[0] !== color
      });

      // Stop sliding if hit opponent
      if (target) break;

      r += dr;
      c += dc;
    }
  }
};


  if (type === "R") {
    slide([
      [1,0], [-1, 0], [0, 1], [0, -1]
    ]);
  }

  if (type === "B") {
    slide([
      [1,1], [1,-1], [-1,1], [-1,-1]
    ]);
  }

  if (type === "Q") {
    slide([
      [1,0], [-1, 0], [0, 1], [0, -1],
      [1,1], [1,-1], [-1,1], [-1,-1]
    ]);
  }

  if (type === "K") {
    [
      [1,0], [-1, 0], [0, 1], [0, -1],
      [1,1], [1,-1], [-1,1], [-1,-1]
    ].forEach(([dr, dc]) => {
      pushMove(row + dr, col + dc);
    });
  }

  return moves;
}
