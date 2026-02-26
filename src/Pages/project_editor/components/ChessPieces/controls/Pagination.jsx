import React from 'react';
import './controls.css';

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  const handlePageSizeChange = (e) => {
    onPageSizeChange(Number(e.target.value));
    onPageChange(1); // 重置到第一页
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 调整起始页以确保显示足够的页数
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-left">
        <span>每页显示：</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="page-size-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="pagination-right">
        <button
          className="page-button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          首页
        </button>
        <button
          className="page-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`page-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="page-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
        <button
          className="page-button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          末页
        </button>
      </div>
    </div>
  );
};

export default Pagination;