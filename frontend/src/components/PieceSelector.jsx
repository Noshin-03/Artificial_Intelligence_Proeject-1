import React, { useState } from 'react';
import './PieceSelector.css';
import './Piece.css'
import Grid from './Grid';
import defaultPieces, { pieceSets } from './pieces';

const PieceSelector = () => {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("hvh"); // hvh or hvb
  const [botColor, setBotColor] = useState("b"); // which side bot plays in hvb
  const [difficulty, setDifficulty] = useState("medium"); // easy, medium, hard

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

      <div className="mode-controls">
        <div className="mode-row">
          <label>Game Mode:</label>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${mode === 'hvh' ? 'active' : ''}`}
              onClick={() => setMode('hvh')}
            >
              Human vs Human
            </button>
            <button
              className={`mode-btn ${mode === 'hvb' ? 'active' : ''}`}
              onClick={() => setMode('hvb')}
            >
              Human vs Bot
            </button>
          </div>
        </div>

        {mode === 'hvb' && (
          <>
            <div className="mode-row">
              <label>Bot Plays:</label>
              <div className="mode-buttons">
                <button
                  className={`mode-btn ${botColor === 'w' ? 'active' : ''}`}
                  onClick={() => setBotColor('w')}
                >
                  White
                </button>
                <button
                  className={`mode-btn ${botColor === 'b' ? 'active' : ''}`}
                  onClick={() => setBotColor('b')}
                >
                  Black
                </button>
              </div>
            </div>

            <div className="mode-row">
              <label>Difficulty:</label>
              <div className="mode-buttons">
                <button
                  className={`mode-btn ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </button>
                <button
                  className={`mode-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </button>
                <button
                  className={`mode-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="board-area">
        {selected ? (
          <Grid piecesMap={pieceSets[selected]} mode={mode} botColor={botColor} difficulty={difficulty} />
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
