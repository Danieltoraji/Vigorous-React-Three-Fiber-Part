//
//创建了 ProjectContext.jsx 来管理项目数据，提供了以下功能：

//- ProjectProvider : Context 提供者组件，包装整个应用
// - useProject : 自定义 Hook，让组件可以访问项目数据
// - 便捷方法 :
//   - getProjectId() : 获取项目 ID
//   - getProjectName() : 获取项目名称
//   - getProjectDescription() : 获取项目描述
//   - getProjectParameters() : 获取项目参数
//   - getProjectStatus() : 获取项目状态
//   - getProjectCreatedAt() : 获取创建时间
//   - updateProjectData() : 更新项目数据
//在任何组件中，你都可以通过以下方式访问项目数据：
//  import { useProject } from './context/ProjectContext.jsx';
//  
//  function MyComponent() {
//    const { 
//      getProjectId, 
//      getProjectName, 
//      getProjectDescription,
//      getProjectParameters,
//      getProjectStatus,
//      getProjectCreatedAt,
//      projectData,
//      updateProjectData
//    } = useProject();
//  
//    const projectId = getProjectId();
//    const projectName = getProjectName();
//    
//    // 使用项目数据...
//  }

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.PROJECT_DATA) {
      setProjectData(window.PROJECT_DATA);
    }
  }, []);

  const updateProjectData = (newData) => {
    setProjectData(newData);
  };

  const getProjectId = () => {
    return projectData?.id;
  };

  const getProjectName = () => {
    return projectData?.name;
  };

  const getProjectDescription = () => {
    return projectData?.description;
  };

  const getProjectParameters = () => {
    return projectData?.parameters;
  };

  const getProjectStatus = () => {
    return projectData?.status;
  };

  const getProjectCreatedAt = () => {
    return projectData?.created_at;
  };

  const value = {
    projectData,
    updateProjectData,
    getProjectId,
    getProjectName,
    getProjectDescription,
    getProjectParameters,
    getProjectStatus,
    getProjectCreatedAt
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
