/**
 * 模板资源管理器
 */
import { useUser } from '../../hooks/useUser.jsx'

function Explorer_templates() {
  const { userData } = useUser()
  return(
    <div className="explorer-templates">
      <h1>模板资源管理器</h1>
      <p>当前用户：{userData.username}</p>
    </div>
  )
}
export default Explorer_templates
