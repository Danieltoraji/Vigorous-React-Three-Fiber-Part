/**
 * 功能菜单目前起首页作用
 */

import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext.jsx'

function Home() {
  const { userData } = useContext(UserContext)
  return (
    <div>
      <h1>欢迎来到功能菜单！</h1>
      <p>欢迎您：{userData.username}</p>
    </div>
  );
}
export default Home