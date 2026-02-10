import ModelPage from './modelpage.jsx'
import Apphead from './Apphead.jsx'
import Appbottom from './Appbottom.jsx'

function App() {
  return(
    <div>
      <Apphead ProjectName="测试项目" />

      <ModelPage />

      <Appbottom />
    </div>
  )
}
export default App