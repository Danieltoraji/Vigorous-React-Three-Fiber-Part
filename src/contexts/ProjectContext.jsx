import { createContext, useState } from 'react'

const ProjectContext = createContext(null)

export function ProjectContextProvider({ children }) {
  const [projectData, setProjectData] = useState({
    name: 'Vigorous-Test-Project',
    description: 'Oiiaioiiiiai',
    user: 'Hajimi',
    created_at: '创建时间不明',
    edited_at: '修改时间也不明',
    status: '还差亿点',
    pieces: '下辖的棋子id集合。',
    shape: '基本单位的形状',
    size: '基本单位的大小。',
    tags: '项目下辖棋子的标签',
  })

  return (
    <ProjectContext.Provider value={{ projectData, setProjectData }}>
      {children}
    </ProjectContext.Provider>
  )
}
export { ProjectContext }