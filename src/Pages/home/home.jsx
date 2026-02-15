/**
 * 功能菜单目前起首页作用
 */

import { useUser } from '../../hooks/useUser.jsx'

function Home() {
  const { userData } = useUser()
  return (
    <div>
      <h1>欢迎来到功能菜单！</h1>
      <p>欢迎您：{userData.username}</p>
    </div>
  );
}
export default Home