import ModelPage from './modelpage.jsx'

function App() {
  return(
    <div>
      <h1>模型展示页面</h1>
      <p>这是我们的第一个React Three Fiber场景！<br></br>
        使用说明：
        1. 鼠标左键拖动可以旋转模型。
        2. 鼠标右键拖动可以平移模型。
        3. 鼠标滚轮可以缩放模型。
      </p>
      <ModelPage />
    </div>
  )
}
export default App