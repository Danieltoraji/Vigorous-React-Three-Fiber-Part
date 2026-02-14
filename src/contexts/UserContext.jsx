/**
 * 这里是提供用户上下文的文件。
 * 它应该包含以下功能：
 * 1a.根据用户ID获取用户信息。
 * 1b.向服务器发送用户信息更新请求。
 * 2a.根据用户ID获取用户项目列表。
 * 2b.向服务器发送项目列表更新请求。
 * 3a.根据用户ID获取用户模板列表。
 * 3b.向服务器发送模板列表更新请求。
 * 4a.根据用户ID获取用户贴图列表。
 * 4b.向服务器发送贴图列表更新请求。
 * 
 */
import { createContext, useContext } from 'react';

const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const userData = {
    id: '31415926',
    username: 'Hajimi',
    projects: ['Vigorous-Test-Project', 'Vigorous-Test-Project-2'],
  };

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };

