import React, { useState, useRef, useEffect } from 'react';
import './AddModelOnLeft.css';

const AddModelOnLeft = ({ isHeaderVisible }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isWindowMode, setIsWindowMode] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  // 发送模型创建请求
  const sendModelRequest = async (shapeType) => {
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      // 构建请求数据
      const requestData = {
        operation: '创建形状',
        shape_type: shapeType,
        parameters: {
          ...getDefaultParameters(shapeType),
          position: { x: 0, y: 0, z: 0 },
          color: '#ffffff'
        },
        timestamp: new Date().toISOString()
      };

      // 发送HTTP请求
      const response = await fetch('http://localhost:8000/api/shapes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFeedback({ type: 'success', message: `成功创建${getShapeName(shapeType)}` });
      console.log('请求成功:', data);

      // 3秒后清除反馈信息
      setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 3000);

    } catch (error) {
      setFeedback({ type: 'error', message: `创建失败: ${error.message}` });
      console.error('请求失败:', error);

      // 3秒后清除错误信息
      setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 3000);

    } finally {
      setLoading(false);
    }
  };

  // 获取形状的默认参数
  const getDefaultParameters = (shapeType) => {
    switch (shapeType) {
      case 'sphere':
        return { radius: 1 };
      case 'box':
        return { width: 2, height: 2, depth: 2 };
      case 'cylinder':
        return { radiusTop: 1, radiusBottom: 1, height: 2, radialSegments: 32 };
      default:
        return {};
    }
  };

  // 获取形状的中文名称
  const getShapeName = (shapeType) => {
    switch (shapeType) {
      case 'sphere':
        return '球体';
      case 'box':
        return '长方体';
      case 'cylinder':
        return '圆柱';
      default:
        return '形状';
    }
  };

  // 开始拖拽
  const handleMouseDown = (e) => {
    if (!isWindowMode) {
      // 从居左模式切换到窗口模式
      setIsWindowMode(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
    } else {
      // 在窗口模式下开始拖拽
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      setIsDragging(true);
    }
  };

  // 执行拖拽
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // 结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 切换到居左模式
  const switchToLeftMode = () => {
    setIsWindowMode(false);
    setPosition({ x: 20, y: 100 });
  };

  // 隐藏面板
  const hidePanel = () => {
    setIsWindowMode(false); // 先切换到居左模式，以便隐藏样式生效
    setIsHidden(true);
  };

  // 显示面板
  const showPanel = () => {
    setIsHidden(false);
  };

  // 全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // 按钮配置
  const buttons = [
    {
      id: 'sphere',
      label: '球体',
      shapeType: 'sphere',
      icon: '🔵'
    },
    {
      id: 'box',
      label: '长方体',
      shapeType: 'box',
      icon: '📦'
    },
    {
      id: 'cylinder',
      label: '圆柱',
      shapeType: 'cylinder',
      icon: '🔷'
    }
  ];

  return (
    <>
      {/* 主容器 */}
      <div
        ref={containerRef}
        className={`add-model-container 
          ${!isHeaderVisible ? 'full-height' : ''}
          ${isWindowMode ? 'window-mode' : ''}
          ${isHidden ? 'hidden' : ''}
          ${isDragging ? 'dragging' : ''}
        `}
        style={isWindowMode ? {
          left: `${position.x}px`,
          top: `${position.y}px`
        } : {}}
      >
        {/* 标题栏 */}
        <h2 
          className="add-model-title"
          onMouseDown={handleMouseDown}
        >
          添加模型
        </h2>
        
        {/* 按钮容器 */}
        <div className="button-container">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`model-button ${loading ? 'loading' : ''}`}
              onClick={() => sendModelRequest(button.shapeType)}
              disabled={loading}
            >
              <div className="button-icon">
                {button.icon}
              </div>
              <span className="button-text">{button.label}</span>
            </button>
          ))}
        </div>

        {/* 反馈信息 */}
        {feedback.message && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        {/* 控制按钮 */}
        <div className="control-buttons">
          {isWindowMode && (
            <button 
              className="control-button"
              onClick={switchToLeftMode}
            >
              居左显示
            </button>
          )}
          <button 
            className="control-button primary"
            onClick={hidePanel}
          >
            隐藏面板
          </button>
        </div>
      </div>

      {/* 显示按钮（当面板隐藏时） */}
      {isHidden && (
        <button 
          className="show-panel-button"
          onClick={showPanel}
        >
          ≡
        </button>
      )}
    </>
  );
};

export default AddModelOnLeft;