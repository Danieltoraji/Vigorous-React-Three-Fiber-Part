/**
 * 资源管理器，用于管理：
 * 项目
 */
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext.jsx'

function ExplorerProject() {
  const { userData } = useContext(UserContext)
  return (
    <div>
      <h1>项目资源管理器</h1>
      <p>当前用户：{userData.username}</p>
    </div>
  )
}
export default ExplorerProject
