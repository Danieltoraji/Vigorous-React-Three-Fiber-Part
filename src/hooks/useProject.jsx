import { useState, useContext, createContext } from 'react';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {

  // 初始化项目数据。现在是模拟数据。
  const [projectData, setProjectData] = useState({
    'Hajimi-123456': {
      name: 'Vigorous-Test-Project',
      id: 'Hajimi-123456',
      description: 'Oiiaioiiiiai',
      user: 'Hajimi',
      created_at: '创建时间不明',
      edited_at: '修改时间也不明',
      status: '还差亿点',
      pieces: [],
      shape: '基本单位的形状',
      size: '基本单位的大小。',
      tags: ['type1','type2'],
    },
    'Hajimi-456789': {
      name: 'Vigorous-Test-Project-2',
      id: 'Hajimi-456789',
      description: '第二个测试项目',
      user: 'Hajimi',
      created_at: '20260215',
      edited_at: '202602151',
      status: '进行中',
      pieces: [],
      shape: '基本单位的形状',
      size: '基本单位的大小。',
      tags: ['type2','type3','type4'],
    }
  });

  //这里马上要写数据逻辑，从后端获取项目数据，向后端同步数据。


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
