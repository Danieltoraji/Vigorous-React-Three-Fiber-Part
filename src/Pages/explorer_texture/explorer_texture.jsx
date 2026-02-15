/**
 * 资源管理器，用于管理：
 * 贴图
 * 纹理
 */
import { useUser } from '../../hooks/useUser.jsx'

function ExplorerTexture() {
  const { userData } = useUser()
  return (
    <div>
      <h1>贴图资源管理器</h1>
      <p>当前用户：{userData.username}</p>
    </div>
  )
}
export default ExplorerTexture