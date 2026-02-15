import { useState, useContext, createContext } from 'react';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {

  // 初始化项目数据。现在是模拟数据。
  const [projectData, setProjectData] = useState({
    'Hajimi-123456': {
      name: 'Vigorous-Test-Project',
      user: 'Hajimi',
      created_at: 'date1',
      edited_at: 'date2',
      id: 'Hajimi-123456',
      description: 'Oiiaioiiiiai',
      status: 'editable',
      feature:{
        shape: 'square',
        size: 10,
      },
      project_tags: ['type1','type2'],
    },
    'Hajimi-456789': {
      name: 'Vigorous-Test-Project',
      user: 'Hajimi',
      created_at: 'date3',
      edited_at: 'date4',
      id: 'Hajimi-456789',
      description: '第二个测试项目',
      status: 'archived',
      feature:{
        shape: 'square',
        size: 10,
      },
      project_tags: ['type3','type4'],
    },
  });

  //这里马上要写逻辑和方法，从后端获取项目数据，向后端同步数据。


  //这里是Context的结尾和Hook，后面是固定的。
  return (
    <ProjectContext.Provider value={{ projectData, setProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
