import React, { useState } from 'react';
import './modals.css';

const ImportChessModal = ({ onCancel, projectId, createChessFromJson }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      setIsParsing(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const jsonContent = e.target.result;
          const chessJson = JSON.parse(jsonContent);
          
          // 调用createChessFromJson创建新棋子
          await createChessFromJson(projectId, chessJson);
          
          setIsParsing(false);
          alert('解析完成，棋子已创建');
          onCancel();
        } catch (error) {
          setIsParsing(false);
          console.error('解析失败详情：', error);
          alert('解析失败：' + error.message);
        }
      };
      
      reader.onerror = () => {
        setIsParsing(false);
        alert('文件读取失败');
      };
      
      reader.readAsText(selectedFile);
    } else {
      alert('请选择JSON文件');
    }
  };

  const handleImportFromTemplate = () => {
    alert('开发中');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>导入棋子</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div 
            className="file-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h4>选择JSON文件</h4>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="file-input"
            />
            <p className="upload-hint">点击或拖拽JSON文件到此处上传</p>
            {selectedFile && (
              <p className="selected-file">已选择: {selectedFile.name}</p>
            )}
            <div className="modal-actions">
              <button 
                className="confirm-button"
                onClick={handleConfirm}
                disabled={isParsing}
              >
                {isParsing ? '解析中...' : '确认'}
              </button>
            </div>
          </div>
          <p>或者...</p>
          <div className="template-import-section">
            <button 
              className="template-import-button"
              onClick={handleImportFromTemplate}
            >
              从模板导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportChessModal;