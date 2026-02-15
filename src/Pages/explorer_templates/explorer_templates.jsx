/**
 * 模板资源管理器
 */
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext.jsx'

function Explorer_templates() {
  const { userData } = useContext(UserContext)
  return(
    <div className="explorer-templates">
      <h1>模板资源管理器</h1>
      <p>当前用户：{userData.username}</p>
    </div>
  )
}
export default Explorer_templates
