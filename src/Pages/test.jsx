import { useUser } from '../hooks/useUser.jsx';
import { useProject } from '../hooks/useProject.jsx';
import { useChess } from '../hooks/useChess.jsx';


function Test() {
  const { userData } = useUser();
  const { projectData } = useProject();
  const { chessData } = useChess();
  return (
    <div>
      <h1>测试页面</h1>
      <p>用户信息：{JSON.stringify(userData)}</p>
      <p>项目信息：{JSON.stringify(projectData)}</p>
      <p>棋子信息：{JSON.stringify(chessData)}</p>
      <p>上述项均为React Context中获取的数据，正确显示说明配置正确</p>
    </div>
  );
}
export default Test