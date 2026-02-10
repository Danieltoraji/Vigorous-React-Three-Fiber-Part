import './App.css'
import ModelPage from './modelpage.jsx'
import Apphead from './Apphead/Apphead.jsx'
import Appbottom from './Appbottom/Appbottom.jsx'
import AddModelOnLeft from './AddModelOnLeft/AddModelOnLeft.jsx'

function App() {
  return(
    <div className="app-container">
      <Apphead ProjectName="测试项目" />
      <div className="app-content">
        <AddModelOnLeft />
        <div className="main-content">
          <ModelPage />
        </div>
      </div>
      <Appbottom />
    </div>
  )
}
export default App