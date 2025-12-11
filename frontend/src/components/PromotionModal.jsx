import React from 'react';
import './PromotionModal.css';
import defaultPieces from './pieces';

const PromotionModal = ({ color, options, onSelect, piecesMap }) => {
  const pieces = piecesMap || defaultPieces;
  
  const pieceNames = {
    'N': 'Knight',
    'R': 'Rook',
    'B': 'Bishop',
    'Q': 'Queen'
  };

  return (
    <div className="promotion-modal-overlay">
      <div className="promotion-modal">
        <h2>Promote Pawn To:</h2>
        <div className="promotion-options">
          {options.map((pieceType) => (
            <button
              key={pieceType}
              className="promotion-option"
              onClick={() => onSelect(pieceType)}
            >
              <img
                src={pieces[color + pieceType]}
                alt={pieceNames[pieceType]}
                className="promotion-piece-img"
              />
              <span>{pieceNames[pieceType]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
