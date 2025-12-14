import React, { useState } from 'react';
import './PieceSelector.css';
import './Piece.css'
import Grid from './Grid';
import defaultPieces, { pieceSets } from './pieces';

const PieceSelector = () => {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("hvh");
  const [botColor, setBotColor] = useState("b");
  const [difficulty, setDifficulty] = useState("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const themes = Object.keys(pieceSets);

  const handleStartGame = () => {
    if (!selected) {
      alert('Please select a piece set first!');
      return;
    }
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setGameStarted(false);
    setGameKey(prev => prev + 1);
  };

  if (gameStarted) {
    return (
      <Grid
        key={gameKey}
        piecesMap={pieceSets[selected]}
        mode={mode}
        botColor={botColor}
        difficulty={difficulty}
        onNewGame={handleNewGame}
        darkMode={true}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            letterSpacing: '2px'
          }}>
            ♟️ CHESS ATTACK
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#9ca3af',
            marginBottom: '4px'
          }}>
            5×6 Mini Chess - Premium Edition
          </p>
          <div style={{
            height: '3px',
            width: '60px',
            backgroundColor: '#22C55E',
            margin: '0 auto'
          }}></div>
        </div>

        {/* Piece Set Selection */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎨</span> Choose Piece Set
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: selected === t ? '3px solid #22C55E' : '2px solid #334155',
                  backgroundColor: selected === t ? '#1E293B' : '#0F172A',
                  color: selected === t ? '#22C55E' : '#9ca3af',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selected === t ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none',
                  transform: selected === t ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#22C55E';
                  e.target.style.backgroundColor = '#1E293B';
                  e.target.style.color = '#22C55E';
                }}
                onMouseLeave={(e) => {
                  if (selected !== t) {
                    e.target.style.borderColor = '#334155';
                    e.target.style.backgroundColor = '#0F172A';
                    e.target.style.color = '#9ca3af';
                  }
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎮</span> Game Mode
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {[
              { id: 'hvh', label: '👥 Human vs Human', emoji: '👥' },
              { id: 'hvb', label: '🤖 Human vs Bot', emoji: '🤖' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: mode === m.id ? '3px solid #3B82F6' : '2px solid #334155',
                  backgroundColor: mode === m.id ? '#1E293B' : '#0F172A',
                  color: mode === m.id ? '#3B82F6' : '#9ca3af',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: mode === m.id ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none',
                  transform: mode === m.id ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.backgroundColor = '#1E293B';
                  e.target.style.color = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  if (mode !== m.id) {
                    e.target.style.borderColor = '#334155';
                    e.target.style.backgroundColor = '#0F172A';
                    e.target.style.color = '#9ca3af';
                  }
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bot Settings */}
        {mode === 'hvb' && (
          <>
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🎯</span> Bot Plays As
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                {[
                  { id: 'w', label: '⚪ White' },
                  { id: 'b', label: '⚫ Black' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setBotColor(c.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: botColor === c.id ? '3px solid #22C55E' : '2px solid #334155',
                      backgroundColor: botColor === c.id ? '#1E293B' : '#0F172A',
                      color: botColor === c.id ? '#22C55E' : '#9ca3af',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: botColor === c.id ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none',
                      transform: botColor === c.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#22C55E';
                      e.target.style.backgroundColor = '#1E293B';
                      e.target.style.color = '#22C55E';
                    }}
                    onMouseLeave={(e) => {
                      if (botColor !== c.id) {
                        e.target.style.borderColor = '#334155';
                        e.target.style.backgroundColor = '#0F172A';
                        e.target.style.color = '#9ca3af';
                      }
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚡</span> Difficulty
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: difficulty === level ? '3px solid #EF4444' : '2px solid #334155',
                      backgroundColor: difficulty === level ? '#1E293B' : '#0F172A',
                      color: difficulty === level ? '#EF4444' : '#9ca3af',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: difficulty === level ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
                      transform: difficulty === level ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#EF4444';
                      e.target.style.backgroundColor = '#1E293B';
                      e.target.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      if (difficulty !== level) {
                        e.target.style.borderColor = '#334155';
                        e.target.style.backgroundColor = '#0F172A';
                        e.target.style.color = '#9ca3af';
                      }
                    }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: selected ? '#22C55E' : '#64748B',
            color: 'white',
            fontWeight: '700',
            fontSize: '18px',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: selected ? '0 8px 24px rgba(34, 197, 94, 0.3)' : 'none',
            transform: 'translateY(0)',
            opacity: selected ? 1 : 0.6,
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            if (selected) {
              e.target.style.backgroundColor = '#16a34a';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (selected) {
              e.target.style.backgroundColor = '#22C55E';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
            }
          }}
          disabled={!selected}
        >
          ▶️ START GAME
        </button>
      </div>
    </div>
  );
};

export default PieceSelector;
