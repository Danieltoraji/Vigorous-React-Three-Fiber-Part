import React from 'react';
import './controls.css';

const SortControls = ({ sortBy, sortOrder, onSortChange }) => {
  const handleSortByChange = (e) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  return (
    <div className="sort-controls">
      <select
        value={sortBy}
        onChange={handleSortByChange}
        className="sort-select"
      >
        <option value="created_at">创建时间</option>
        <option value="edited_at">最后编辑时间</option>
        <option value="name">名称</option>
      </select>
      <button
        className="sort-order-button"
        onClick={handleSortOrderChange}
        title={sortOrder === 'asc' ? '切换为降序' : '切换为升序'}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortControls;