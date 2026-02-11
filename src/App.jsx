import './App.css'
import ModelPage from './modelpage.jsx'
import Apphead from './Apphead/Apphead.jsx'
import Appbottom from './Appbottom/Appbottom.jsx'
import AddModelOnLeft from './AddModelOnLeft/AddModelOnLeft.jsx'
import React, { useState } from 'react';

function App() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  // 3D场景中的对象列表
  const [sceneObjects, setSceneObjects] = useState([]);

  const handleHeaderToggle = (visible) => {
    setIsHeaderVisible(visible);
  };

  // 处理添加新对象到场景
  const handleAddObject = (newObject) => {
    setSceneObjects(prev => [...prev, { ...newObject, id: Date.now() }]);
  };

  return(
    <div className="app-container">
      <Apphead ProjectName="测试项目" onToggle={handleHeaderToggle} />
      <div className="app-content">
        <AddModelOnLeft 
          isHeaderVisible={isHeaderVisible} 
          onAddObject={handleAddObject}
        />
        <div className="main-content">
          <ModelPage objects={sceneObjects} />
        </div>
      </div>
      <Appbottom />
    </div>
  )
}
export default App