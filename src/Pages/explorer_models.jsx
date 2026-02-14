/**
 * 模板资源管理器
 */
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext.jsx'

function Explorer_models() {
  const { userData } = useContext(UserContext)
  return(
    <div className="explorer-models">
      <h1>模板资源管理器</h1>
      <p>当前项目：{userData.name}</p>
    </div>
  )
}
export default Explorer_models