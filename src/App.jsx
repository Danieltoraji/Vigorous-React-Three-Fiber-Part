import './App.css'
import ModelPage from './modelpage.jsx'
import Apphead from './Apphead/Apphead.jsx'
import Appbottom from './Appbottom/Appbottom.jsx'
import AddModelOnLeft from './AddModelOnLeft/AddModelOnLeft.jsx'
import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProject } from './contexts/ProjectContext.jsx';

// 主应用组件包装器
function AppWrapper() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { projectData, updateProjectInfo, addModelToProject } = useProject();

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

  // 监听表单变化并同步到项目数据
  useEffect(() => {
    const projectNameInput = document.getElementById('projectName');
    const projectDescInput = document.getElementById('projectDescription');

    if (projectNameInput && projectDescInput) {
      const handleNameChange = () => {
        if (projectData) {
          updateProjectInfo({ name: projectNameInput.value });
        }
      };

      const handleDescChange = () => {
        if (projectData) {
          updateProjectInfo({ description: projectDescInput.value });
        }
      };

      projectNameInput.addEventListener('input', handleNameChange);
      projectDescInput.addEventListener('input', handleDescChange);

      return () => {
        projectNameInput.removeEventListener('input', handleNameChange);
        projectDescInput.removeEventListener('input', handleDescChange);
      };
    }
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
            <form id="projectEditorForm">
              <div className="form-group">
                <label htmlFor="projectName" className="form-label">项目名称</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={projectData?.name || "新建项目"}
                  placeholder="请输入项目名称"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDescription" className="form-label">项目描述</label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder="请输入项目描述"
                  className="form-textarea"
                  defaultValue={projectData?.description || ""}
                />
              </div>

              <div className="button-group">
                <button type="submit" id="saveProjectBtn" className="btn btn-primary">
                  <span className="btn-text">保存项目</span>
                  <span className="spinner" style={{ display: 'none' }}></span>
                </button>
                <button type="button" id="deleteProjectBtn" className="btn btn-danger" style={{ display: projectData?.id ? 'flex' : 'none' }}>
                  <span className="btn-text">删除项目</span>
                </button>
              </div>
              <div id="successMessage" className="message message-success"></div>
              <div id="errorMessage" className="message message-error"></div>
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