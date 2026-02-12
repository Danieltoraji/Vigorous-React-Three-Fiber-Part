import './App.css'
import ModelPage from './modelpage.jsx'
import Apphead from './Apphead/Apphead.jsx'
import Appbottom from './Appbottom/Appbottom.jsx'
import AddModelOnLeft from './AddModelOnLeft/AddModelOnLeft.jsx'
import React, { useState } from 'react';
import { useProject } from './context/ProjectContext.jsx';

function App() {
  const { getProjectName } = useProject();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAddModelHidden, setIsAddModelHidden] = useState(false);

  const handleHeaderToggle = (visible) => {
    setIsHeaderVisible(visible);
  };

  const handleAddModelToggle = (hidden) => {
    setIsAddModelHidden(hidden);
  };

  const projectName = getProjectName() || '未命名项目';

  return(
    <div className="app-container">
      <Apphead ProjectName={projectName} onToggle={handleHeaderToggle} />
      <div className="app-content">
        <AddModelOnLeft isHeaderVisible={isHeaderVisible} onToggle={handleAddModelToggle} />
        <div className={`main-content ${isAddModelHidden ? 'full-width' : ''}`}>
          <ModelPage />
        </div>
      </div>
      <Appbottom />
    </div>
  )
}
export default App