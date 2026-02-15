import { useState, useContext, createContext } from 'react';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projectData, setProjectData] = useState({
    'Hajimi-123456': {
      name: 'Vigorous-Test-Project',
      id: 'Hajimi-123456',
      description: 'Oiiaioiiiiai',
      user: 'Hajimi',
      created_at: '创建时间不明',
      edited_at: '修改时间也不明',
      status: '还差亿点',
      pieces: '下辖的棋子id集合。',
      shape: '基本单位的形状',
      size: '基本单位的大小。',
      tags: '项目标签1',
      chess_tags: '项目下辖棋子的标签',
    },
    'Hajimi-456789': {
      name: 'Vigorous-Test-Project-2',
      id: 'Hajimi-456789',
      description: '第二个测试项目',
      user: 'Hajimi',
      created_at: '20260215',
      edited_at: '202602151',
      status: '进行中',
      pieces: '下辖的棋子id集合。',
      shape: '基本单位的形状',
      size: '基本单位的大小。',
      tags: '项目标签2',
      chess_tags: '项目下辖棋子的标签',
    }
  });

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
