import './App.css'
import ModelPage from './modelpage.jsx'
import Apphead from './Apphead/Apphead.jsx'
import Appbottom from './Appbottom/Appbottom.jsx'
import AddModelOnLeft from './AddModelOnLeft/AddModelOnLeft.jsx'
import React, { useState, useEffect, useRef } from 'react';
import { ProjectProvider, useProject } from './contexts/ProjectContext.jsx';

// 主应用组件包装器
function AppWrapper() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { projectData, updateProjectInfo, addModelToProject } = useProject();
  const projectNameRef = useRef();
  const projectDescRef = useRef();

  const handleHeaderToggle = (visible) => {
    setIsHeaderVisible(visible);
  };

  // 处理添加新对象到场景
  const handleAddObject = (newObject) => {
    // 添加到3D场景
    setSceneObjects(prev => [...prev, { ...newObject, id: Date.now() }]);

    // 同时添加到项目数据中
    if (projectData) {
      addModelToProject({
        ...newObject,
        id: Date.now(),
        addedAt: new Date().toISOString()
      });
    }
  };

  // 3D场景中的对象列表
  const [sceneObjects, setSceneObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // 保存项目到API的函数
  const saveProjectToAPI = async (projectInfo) => {
    try {
      setIsLoading(true);
      setMessage({ text: '', type: '' });

      // 发送API请求
      const response = await fetch('/api/test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectData?.id || null,
          projectName: projectInfo.name,
          projectDescription: projectInfo.description,
          models: sceneObjects,
          createdAt: projectData?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 显示成功消息
      setMessage({ text: '项目保存成功！', type: 'success' });

      // 更新项目数据
      if (result.projectId && !projectData?.id) {
        updateProjectInfo({ id: result.projectId });
      }

      return result;
    } catch (error) {
      console.error('保存项目失败:', error);

      // 显示错误消息
      setMessage({ text: '保存项目失败，请稍后重试', type: 'error' });

      throw error;
    } finally {
      setIsLoading(false);
      // 3秒后清除消息
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  // 表单提交处理函数
  const handleSaveProject = async (e) => {
    e.preventDefault();

    // 获取表单数据
    const projectName = projectNameRef.current?.value || projectData?.name || "新建项目";
    const projectDescription = projectDescRef.current?.value || projectData?.description || "";

    // 更新项目信息
    if (projectData) {
      updateProjectInfo({
        name: projectName,
        description: projectDescription
      });
    }

    // 准备要发送的数据
    const projectInfo = {
      name: projectName,
      description: projectDescription
    };

    // 调用API保存
    try {
      await saveProjectToAPI(projectInfo);
    } catch (error) {
      // 错误已在saveProjectToAPI中处理
      console.error('保存操作失败:', error);
    }
  };


  // 设置表单初始值并监听变化
  useEffect(() => {
    if (projectNameRef.current && projectData?.name) {
      projectNameRef.current.value = projectData.name;
    }
    if (projectDescRef.current && projectData?.description) {
      projectDescRef.current.value = projectData.description;
    }

    // 添加事件监听器
    const handleNameChange = () => {
      if (projectData && projectNameRef.current) {
        updateProjectInfo({ name: projectNameRef.current.value });
      }
    };

    const handleDescChange = () => {
      if (projectData && projectDescRef.current) {
        updateProjectInfo({ description: projectDescRef.current.value });
      }
    };

    const nameInput = projectNameRef.current;
    const descInput = projectDescRef.current;

    if (nameInput) {
      nameInput.addEventListener('input', handleNameChange);
    }
    if (descInput) {
      descInput.addEventListener('input', handleDescChange);
    }

    return () => {
      if (nameInput) {
        nameInput.removeEventListener('input', handleNameChange);
      }
      if (descInput) {
        descInput.removeEventListener('input', handleDescChange);
      }
    };
  }, [projectData, updateProjectInfo]);

  return (
    <div className="app-container">
      <Apphead
        ProjectName={projectData?.name || "3D模型编辑器"}
        onToggle={handleHeaderToggle}
      />
      <div className="app-content">
        {/* 左侧：模型工具面板 */}

        <AddModelOnLeft
          isHeaderVisible={isHeaderVisible}
          onAddObject={handleAddObject}
        />



        {/* 中间：3D编辑器区域 */}

        <div className="canvas-container">
          <ModelPage objects={sceneObjects} />
        </div>


        {/* 右侧：项目信息面板 */}
        <div className="project-panel">
          <div className="project-header">
            <h2 className="project-title">📋 项目信息</h2>
          </div>
          <div className="project-form">
            <form id="projectEditorForm" onSubmit={handleSaveProject}>
              <div className="form-group">
                <label htmlFor="projectName" className="form-label">项目名称</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  ref={projectNameRef}
                  defaultValue={projectData?.name || "新建项目"}
                  placeholder="请输入项目名称"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDescription" className="form-label">项目描述</label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  ref={projectDescRef}
                  placeholder="请输入项目描述"
                  className="form-textarea"
                  defaultValue={projectData?.description || ""}
                  disabled={isLoading}
                />
              </div>

              <div className="button-group">
                <button type="submit" id="saveProjectBtn" className="btn btn-primary" disabled={isLoading}>
                  <span className="btn-text">{isLoading ? '保存中...' : '保存项目'}</span>
                  <span className="spinner" style={{ display: isLoading ? 'inline-block' : 'none' }}></span>
                </button>
                <button type="button" id="deleteProjectBtn" className="btn btn-danger" style={{ display: projectData?.id ? 'flex' : 'none' }} disabled={isLoading}>
                  <span className="btn-text">删除项目</span>
                </button>
              </div>
              {message.text && (
                <div className={`message message-${message.type} show`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Appbottom />
    </div>
  )
}

// 主应用入口组件
function App() {
  return (
    <ProjectProvider>
      <AppWrapper />
    </ProjectProvider>
  );
}

export default App