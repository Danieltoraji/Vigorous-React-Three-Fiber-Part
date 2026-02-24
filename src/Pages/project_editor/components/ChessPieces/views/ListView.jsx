import React from 'react';
import './views.css';

const ListView = ({ pieces, onEdit, onOpen, onDelete }) => {
  return (
    <div className="list-view">
      <table className="chess-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>ID</th>
            <th>类型</th>
            <th>标签</th>
            <th>创建时间</th>
            <th>最后编辑</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id}>
              <td>{piece.name}</td>
              <td>{piece.id}</td>
              <td>{piece.type}</td>
              <td>
                <div className="table-tags">
                  {piece.piece_tags && piece.piece_tags.length > 0 ? (
                    piece.piece_tags.map((tag, index) => (
                      <span key={index} className="table-tag">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="no-tags">无</span>
                  )}
                </div>
              </td>
              <td>{piece.created_at}</td>
              <td>{piece.edited_at}</td>
              <td className="action-buttons">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;