import { useUser } from '../hooks/useUser.jsx';
import { useProject } from '../hooks/useProject.jsx';


function Test() {
  const { userData } = useUser();
  const { projectData } = useProject();
  return (
    <div>
      <p>用户ID: {userData.id}</p>
      <p>用户名: {userData.username}</p>
      <p>用户项目列表：{userData.projects.join(', ')}</p>
      <p>上述项均为React Context中获取的数据，正确显示说明配置正确</p>
    </div>
  );
}
export default Test