import { useState, useContext, useEffect, createContext } from 'react';
const ChessContext = createContext(null);

export function ChessProvider({ children }) {

  // A 初始化棋子数据。现在是模拟数据。以后会设为空对象。
  const [chessData, setChessData] = useState({
    '1': {
      name: '测试棋子1',
      project: 1,
      type: 'pawn',
      created_at: 'date1',
      edited_at: 'date2',
      id: 1,
      description: '这是一个测试棋子',
      feature: {
        shape: 'circle',
        size: 5,
      },
      parts: {
        body: 'part-001',
        head: 'part-002'
      },
      piece_tags: ['type1', 'type2'],
      user: 1,
    },
    '2': {
      name: '测试棋子2',
      project: 1,
      type: 'knight',
      created_at: 'date3',
      edited_at: 'date4',
      id: 2,
      description: '第二个测试棋子',
      feature: {
        shape: 'triangle',
        size: 8,
      },
      parts: {
        body: 'part-003',
        head: 'part-004'
      },
      piece_tags: ['type3', 'type4'],
      user: 1,
    },
  });

  //B 这里要写逻辑和方法，从后端获取棋子数据，向后端同步数据。
  //B1 设置状态管理，包括加载中、错误、最后更新时间。默认：加载中、无错误、无最后更新时间
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  //B2 方法：获取所有棋子（从后端拉取）
  const fetchChess = async (params = {}) => {
    try {
      //B21 向后端请求
      setLoading(true);
      const queryString = new URLSearchParams(params).toString();
      const url = `/api/pieces/${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('获取棋子失败');
      const data = await response.json();
      //B22 数据处理
      // 后端返回的数据格式假设是：[{ id: '...', name: '...' }, ...]
      // 要转换成你的格式：{ '棋子id': { ...棋子详情 } }
      const chessMap = {};
      data.forEach(chess => {
        chessMap[chess.id] = chess;
      });
      //B23 传出数据，设置状态
      setChessData(chessMap);
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('获取棋子失败:', err);
    } finally {
      setLoading(false);
    }
  }
  //B2' 组件加载时自动运行B2获取数据
  useEffect(() => {
    fetchChess();
  }, []);

  //B3 方法：刷新（从后端拉取）棋子数据
  const refreshChess = () => {
    fetchChess();
  };

  //B4 方法：创建棋子（向后端发送）
  const createChess = async (chessData) => {
    try {
      const response = await fetch('/api/pieces/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chessData)
      });
      if (!response.ok) throw new Error('创建棋子失败');
      const newChess = await response.json();
      
      // 后端返回的新棋子应该包含 id
      setChessData(prev => ({
        ...prev,
        [newChess.id]: newChess
      }));
      
      return newChess;
    } catch (err) {
      console.error('创建棋子失败:', err);
      throw err;
    }
  };
  /*B4 注释
  发送到后端的请求格式
      POST /api/pieces/
      Content-Type: application/json
      {
        "name": "棋子名称",          // 必填
        "project": 1,                // 必填，所属项目ID
        "type": "pawn",             // 可选
        "description": "棋子描述",     // 可选
        "feature": {                 // 可选，JSON格式
          "shape": "circle",
          "size": 5
        },
        "parts": {                   // 可选，JSON格式
          "body": "part-001",
          "head": "part-002"
        },
        "piece_tags": ["type1", "type2"]  // 可选，字符串数组
      }
  后端返回的数据格式
      {
        id: 1,                          // 后端生成的唯一ID，Integer
        name: '棋子名称',
        project: 1,                     // 所属项目ID
        type: 'pawn',
        description: '棋子描述',
        feature: {
          shape: 'circle',
          size: 5,
        },
        parts: {
          body: 'part-001',
          head: 'part-002'
        },
        piece_tags: ['type1', 'type2'],
        user: 1,                        // 自动绑定当前登录用户ID
        created_at: '2024-01-01T00:00:00Z',  // 后端生成的时间戳
        edited_at: '2024-01-01T00:00:00Z',   // 后端生成的时间戳
      }
  在添加新棋子时，只需要提供新棋子的详细信息，后端会生成唯一ID、用户ID、创建时间、编辑时间。
  而且无需连带既有棋子。
  比如：
      createChess({
        name: '新棋子-2024',
        project: 1,                   // 必填
        type: 'pawn',
        description: '这是一个新创建的棋子',
        feature: {
          shape: 'circle',
          size: 5
        },
        parts: {
          body: 'part-001',
          head: 'part-002'
        },
        piece_tags: ['new', 'test']
      });
*/

  //B5 方法：更新棋子（修改棋子字段后向后端发送）
  const updateChess = async (chessId, updatedData) => {
    // 先保存旧值（万一失败要恢复）
    const oldData = chessData[chessId];
    
    // 乐观更新：立即更新界面
    setChessData(prev => ({
      ...prev,
      [chessId]: {
        ...prev[chessId],
        ...updatedData
      }
    }));
    
    try {
      const response = await fetch(`/api/pieces/${chessId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)//这里粗暴地将所有字段都发送给后端，无论改没改
      });
      
      if (!response.ok) throw new Error('更新棋子失败');
      
      // 后端可能返回更新后的完整数据
      const updatedFromServer = await response.json();
      
      // 用后端返回的数据再次更新（确保一致）
      setChessData(prev => ({
        ...prev,
        [chessId]: updatedFromServer
      }));
      
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      // 失败：恢复旧数据
      setChessData(prev => ({
        ...prev,
        [chessId]: oldData
      }));
      console.error('更新棋子失败:', err);
      throw err;
    }
  };

  //B6 方法：删除棋子（向后端发送）
  const deleteChess = async (chessId) => {
    // 先保存旧值
    const oldData = { ...chessData };
    const chessExists = chessId in chessData;
    
    if (!chessExists) return;
    
    // 乐观更新：立即从界面移除
    setChessData(prev => {
      const newData = { ...prev };
      delete newData[chessId];
      return newData;
    });
    
    try {
      const response = await fetch(`/api/pieces/${chessId}/`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('删除棋子失败');
      
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      // 失败：恢复被删除的棋子
      setChessData(oldData);
      console.error('删除棋子失败:', err);
      throw err;
    }
  };

  // B7. 总结：提供给组件的数据和方法
  const value = {
    // 数据
    chessData,
    loading,
    error,
    lastUpdated,
    
    // 读取方法
    fetchChess,
    refreshChess,
    
    // 修改方法
    createChess,
    updateChess,
    deleteChess,
    
    // 如果你还想保留原始的 setChessData（用于特殊情况）
    setChessData
  };
  //C 这里是Context的结尾和Hook，后面是固定的。
  return (
    <ChessContext.Provider value={value}>
      {children}
    </ChessContext.Provider>
  );
}

  //D 这里是Hook，用于在组件中使用棋子数据。
export function useChess() {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error('useChess must be used within a ChessProvider');
  }
  return context;
}
