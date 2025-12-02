import React, { useState } from 'react';
import './PieceSelector.css';
import './Piece.css'
import Grid from './Grid';
import defaultPieces, { pieceSets } from './pieces';

const PieceSelector = () => {
  const [selected, setSelected] = useState(null);

  const themes = Object.keys(pieceSets);

  return (
    <div className="selector-root">
      <h2>Choose a piece set</h2>
      <h2 id='welcome-text'>Welcome to Chess Attack (a 5X6 mini chess game) </h2>
      <div className="buttons">
        {themes.map((t) => (
          <button
            key={t}
            className={`theme-btn ${selected === t ? 'active' : ''}`}
            onClick={() => setSelected(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="board-area">
        {selected ? (
          <Grid piecesMap={pieceSets[selected]} />
        ) : (
          <div className="placeholder">
            <p>No set selected. Choose one above to show the board.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieceSelector;
