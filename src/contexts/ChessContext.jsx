import { createContext, useState } from 'react'

const ChessContext = createContext(null)

export function ChessContextProvider({ children }) {
  const [chessData, setChessData] = useState({
    id: 'Hajimi-2023-10-10-10-10-10',
    name: 'Vigorous-Test-Chess',
    user: 'Hajimi',
    created_at: '2023-10-10 10:10:10',
    edited_at: '2026-02-14 20:26:00',
    parts: [],
    type: '普通类',
    shape: '矩形',
    size: '100',
    tags: ['测试类别1', '测试类别2'],
  })
  return (
    <ChessContext.Provider value={{ chessData, setChessData }}>
      {children}
    </ChessContext.Provider>
  )
}
export { ChessContext }