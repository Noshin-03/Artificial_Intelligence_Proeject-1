import React from 'react';
import defaultPieces from './pieces';

const PromotionModal = ({ color, options, onSelect, piecesMap, darkMode }) => {
  const pieces = piecesMap || defaultPieces;
  
  const pieceNames = {
    'N': 'Knight',
    'R': 'Rook',
    'B': 'Bishop',
    'Q': 'Queen'
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn ${
      darkMode ? 'bg-black/70' : 'bg-black/60'
    }`}>
      <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-slideIn ${
        darkMode ? 'bg-chess-dark-panel border-2 border-chess-dark-border' : 'bg-white'
      }`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          ♟️ Promote Pawn
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {options.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-110 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-chess-dark-border hover:bg-chess-action-primary/30 text-white hover:text-chess-action-primary border border-chess-action-primary/50 hover:border-chess-action-primary' 
                  : 'bg-gray-50 hover:bg-chess-action-primary hover:text-white text-gray-900'
              } shadow-lg hover:shadow-xl font-semibold`}
            >
              <img
                src={pieces[color + pieceType]}
                alt={pieceNames[pieceType]}
                className="w-16 h-16 object-contain drop-shadow-lg"
              />
              <span className="text-base">{pieceNames[pieceType]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
