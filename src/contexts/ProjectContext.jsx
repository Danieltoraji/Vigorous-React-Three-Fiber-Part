import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建项目上下文
const ProjectContext = createContext();

// 项目管理Provider组件
export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState(null);
  const [isProjectModified, setIsProjectModified] = useState(false);

  // 从localStorage加载项目数据
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        const parsedProject = JSON.parse(savedProject);
        setProjectData(parsedProject);
        console.log('📂 从本地存储加载项目:', parsedProject);
      } catch (error) {
        console.error('❌ 解析保存的项目数据失败:', error);
      }
    }
  }, []);

  // 保存项目到localStorage
  const saveProjectToLocal = (project) => {
    try {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('💾 项目已保存到本地存储:', project);
    } catch (error) {
      console.error('❌ 保存项目到本地存储失败:', error);
    }
  };

  // 创建新项目
  const createNewProject = (name = '新建项目', description = '') => {
    const newProject = {
      id: Date.now(),
      name,
      description,
      created_at: new Date().toISOString(),
      edited_at: new Date().toISOString(),
      models: [] // 存储3D模型数据
    };
    
    setProjectData(newProject);
    setIsProjectModified(false);
    saveProjectToLocal(newProject);
    
    // 更新表单
    const projectNameInput = document.getElementById('projectName');
    const projectDescInput = document.getElementById('projectDescription');
    if (projectNameInput) projectNameInput.value = name;
    if (projectDescInput) projectDescInput.value = description;
    
    console.log('✨ 新项目已创建:', newProject);
    return newProject;
  };

  // 更新项目信息
  const updateProjectInfo = (updates) => {
    if (!projectData) return null;
    
    const updatedProject = {
      ...projectData,
      ...updates,
      edited_at: new Date().toISOString()
    };
    
    setProjectData(updatedProject);
    setIsProjectModified(true);
    saveProjectToLocal(updatedProject);
    
    console.log('✏️ 项目信息已更新:', updates);
    return updatedProject;
  };

  // 添加3D模型到项目
  const addModelToProject = (modelData) => {
    if (!projectData) {
      // 如果没有项目，先创建一个
      createNewProject();
      return addModelToProject(modelData);
    }
    
    const updatedModels = [...(projectData.models || []), modelData];
    const updatedProject = {
      ...projectData,
      models: updatedModels,
      edited_at: new Date().toISOString()
    };
    
    setProjectData(updatedProject);
    setIsProjectModified(true);
    saveProjectToLocal(updatedProject);
    
    console.log('➕ 模型已添加到项目:', modelData);
    return updatedProject;
  };

  // 从项目中移除模型
  const removeModelFromProject = (modelId) => {
    if (!projectData || !projectData.models) return null;
    
    const updatedModels = projectData.models.filter(model => model.id !== modelId);
    const updatedProject = {
      ...projectData,
      models: updatedModels,
      edited_at: new Date().toISOString()
    };
    
    setProjectData(updatedProject);
    setIsProjectModified(true);
    saveProjectToLocal(updatedProject);
    
    console.log('➖ 模型已从项目移除:', modelId);
    return updatedProject;
  };

  // 清空项目
  const clearProject = () => {
    setProjectData(null);
    setIsProjectModified(false);
    localStorage.removeItem('currentProject');
    
    // 清空表单
    const projectNameInput = document.getElementById('projectName');
    const projectDescInput = document.getElementById('projectDescription');
    if (projectNameInput) projectNameInput.value = '新建项目';
    if (projectDescInput) projectDescInput.value = '';
    
    console.log('🗑️ 项目已清空');
  };

  // 上下文值
  const contextValue = {
    projectData,
    isProjectModified,
    createNewProject,
    updateProjectInfo,
    addModelToProject,
    removeModelFromProject,
    clearProject,
    setIsProjectModified
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

// 自定义Hook用于访问项目上下文
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject必须在ProjectProvider内部使用');
  }
  return context;
};

export default ProjectContext;