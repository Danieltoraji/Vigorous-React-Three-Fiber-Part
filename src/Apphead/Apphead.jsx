/*
 * Apphead.jsx
 * 该文件定义了我们前端项目的头部。
 * 它包含了我们的项目的标题、导航栏等。
 */
import './Apphead.css';
import React, { useState, useEffect, useRef } from 'react';
import ReturnHome from './ReturnHome/ReturnHome.jsx';

function Apphead({ProjectName, onToggle}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (overlayRef.current) {
      overlayRef.current.classList.remove('show');
    }
    if (contentRef.current) {
      contentRef.current.classList.remove('show');
    }
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  const toggleHeader = () => {
    const newVisibility = !isHeaderVisible;
    setIsHeaderVisible(newVisibility);
    if (onToggle) {
      onToggle(newVisibility);
    }
  };

  useEffect(() => {
    if (isModalOpen && overlayRef.current && contentRef.current) {
      // 触发重排，确保动画能够正常执行
      overlayRef.current.offsetHeight;
      overlayRef.current.classList.add('show');
      contentRef.current.classList.add('show');
    }
  }, [isModalOpen]);

  return(
    <>
      <div className={`app-header ${isHeaderVisible ? 'visible' : 'hidden'}`}>
        <div className="header-content">
          <div className="header-left">
            <ReturnHome />
            <h1>{ProjectName}</h1>
            <div className="header-controls">
              <p className="description">【模型编辑器】</p>
              <button className="instructions-button" onClick={openModal}>
                查看使用说明
              </button>
            </div>
          </div>
          <div className="header-right">
            <button className="toggle-header-button" onClick={toggleHeader}>
              {isHeaderVisible ? '隐藏头部' : '显示头部'}
            </button>
          </div>
        </div>
      </div>
      
      {!isHeaderVisible && (
        <button className="header-toggle-float" onClick={toggleHeader}>
          显示头部
        </button>
      )}

      {isModalOpen && (
        <div ref={overlayRef} className="modal-overlay" onClick={closeModal}>
          <div ref={contentRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>使用说明</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <ol>
                <li>鼠标左键拖动可以旋转模型。</li>
                <li>鼠标右键拖动可以平移模型。</li>
                <li>鼠标滚轮可以缩放模型。</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Apphead