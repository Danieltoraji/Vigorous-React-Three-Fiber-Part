import { useState, useContext, createContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    id: '31415926',
    username: 'Hajimi',
    projects: ['Hajimi-123456', 'Hajimi-456789'],
  });

  // 用于更新用户数据的函数，确保id和username不可修改
  const updateUserData = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      ...updatedData,
      // 保留原始的id和username
      id: prev.id,
      username: prev.username
    }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
