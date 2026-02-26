import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ selectedTags, onTagsChange, filterLogic, onLogicChange }) => {
  // 模拟标签选项（实际应该从后端获取）
  const allTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
  const [newTag, setNewTag] = useState('');

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddTag = () => {
    if (newTag && !allTags.includes(newTag)) {
      // 这里应该调用API添加新标签
      // 暂时只更新本地状态
      allTags.push(newTag);
      onTagsChange([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>标签筛选</h3>
      </div>
      <div className="filter-content">
        <div className="tag-options">
          {allTags.map((tag) => (
            <label key={tag} className="tag-checkbox">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
        <div className="add-tag-section">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="添加新标签"
          />
          <button 
            className="add-tag-btn"
            onClick={handleAddTag}
          >
            添加
          </button>
        </div>
        <div className="filter-logic">
          <label>高级筛选：</label>
          <select
            value={filterLogic}
            onChange={(e) => onLogicChange(e.target.value)}
          >
            <option value="AND">标签全部匹配</option>
            <option value="OR">标签任一匹配</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;