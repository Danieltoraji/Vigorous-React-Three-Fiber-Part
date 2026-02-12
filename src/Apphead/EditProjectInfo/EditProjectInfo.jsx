import './EditProjectInfo.css';
import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext.jsx';

function EditProjectInfo({ isOpen, onClose }) {
  const { projectData, updateProjectData } = useProject();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (projectData) {
      setFormData({
        name: projectData.name || '',
        description: projectData.description || ''
      });
    }
  }, [projectData]);

  useEffect(() => {
    if (isOpen && overlayRef.current && contentRef.current) {
      overlayRef.current.offsetHeight;
      overlayRef.current.classList.add('show');
      contentRef.current.classList.add('show');
    } else if (!isOpen && overlayRef.current && contentRef.current) {
      overlayRef.current.classList.remove('show');
      contentRef.current.classList.remove('show');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectId = projectData?.id;

      const response = await fetch('/api/save-project/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          projectId: projectId,
          name: formData.name,
          description: formData.description,
          parameters: projectData?.parameters || {}
        })
      });

      if (!response.ok) {
        throw new Error('保存项目信息失败');
      }

      const result = await response.json();
      if (result.success) {
        updateProjectData({
          id: result.project_id,
          name: formData.name,
          description: formData.description,
          parameters: projectData?.parameters || {},
          status: 'draft',
          created_at: result.created_at || projectData?.created_at
        });
        onClose();
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (error) {
      console.error('保存项目信息时出错:', error);
      alert('保存失败，请重试');
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="edit-project-overlay" onClick={onClose}>
      <div ref={contentRef} className="edit-project-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-project-header">
          <h2>{projectData?.id ? '编辑项目信息' : '创建新项目'}</h2>
          <button className="edit-project-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="edit-project-form">
          <div className="form-group">
            <label htmlFor="name">项目名称</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">项目描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectInfo;