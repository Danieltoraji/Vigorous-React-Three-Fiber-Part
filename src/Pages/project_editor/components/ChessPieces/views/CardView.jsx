import React from 'react';
import './views.css';

const CardView = ({ pieces, onEdit, onOpen, onDelete }) => {
  return (
    <div className="card-view">
      {pieces.map((piece) => (
        <div key={piece.id} className="chess-card">
          <div className="chess-card-header">
            <h3>{piece.name}</h3>
            <span className="chess-type">{piece.type}</span>
          </div>
          <div className="chess-card-body">
            <div className="chess-meta">
              <span>ID: {piece.id}</span>
              <span>创建时间: {piece.created_at}</span>
              <span>最后编辑: {piece.edited_at}</span>
            </div>
            {piece.piece_tags && piece.piece_tags.length > 0 && (
              <div className="chess-tags">
                {piece.piece_tags.map((tag, index) => (
                  <span key={index} className="chess-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="chess-card-actions">
            <button 
              className="action-button edit-button"
              onClick={() => onEdit(piece)}
            >
              编辑
            </button>
            <button 
              className="action-button open-button"
              onClick={() => onOpen(piece)}
            >
              打开
            </button>
            <button 
              className="action-button delete-button"
              onClick={() => onDelete(piece)}
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;