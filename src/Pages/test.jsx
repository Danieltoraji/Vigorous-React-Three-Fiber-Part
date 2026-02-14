import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import { ProjectContext } from '../contexts/ProjectContext.jsx';


function Test() {
  const { userData } = useContext(UserContext);
  const { projectData } = useContext(ProjectContext);
  return (
    <div>
      <p>用户ID: {userData.id}</p>
      <p>用户名: {userData.username}</p>
      <p>项目名称: {projectData.name}</p>
      <p>项目描述: {projectData.description}</p>
      <p>项目状态: {projectData.status}</p>
      <p>项目创建时间: {projectData.created_at}</p>
      <p>项目修改时间: {projectData.edited_at}</p>
      <p>上述项均为React Context中获取的数据，正确显示说明配置正确</p>
    </div>
  );
}
export default Test