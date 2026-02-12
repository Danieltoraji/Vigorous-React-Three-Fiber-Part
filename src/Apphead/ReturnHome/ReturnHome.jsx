import React from 'react';
import './ReturnHome.css';

function ReturnHome() {
  const handleReturnHome = () => {
    window.location.href = 'http://8.141.101.177:8000/';
  };

  return (
    <button className="return-home-button" onClick={handleReturnHome}>
      返回首页
    </button>
  );
}

export default ReturnHome;
