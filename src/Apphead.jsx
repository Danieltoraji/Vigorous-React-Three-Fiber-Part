/*
 * Apphead.jsx
 * 该文件定义了我们前端项目的头部和四周。
 * 它包含了我们的项目的标题、导航栏等。
 */
import './Apphead.css';

function Apphead({ProjectName}) {
  return(
    <div>
      <h1>模型编辑器</h1>
        <p class = "description">您正在编辑项目：{ProjectName}<br></br>
        <div className="tooltip-container" onMouseEnter={(e) => {
          const tooltip = e.currentTarget.querySelector('.tooltip-content');
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
          }
        }} onMouseLeave={(e) => {
          const tooltip = e.currentTarget.querySelector('.tooltip-content');
          if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
          }
        }}>
          <span className="tooltip-trigger">查看使用说明</span>
          <div className="tooltip-content">
            <ol>
              <li>鼠标左键拖动可以旋转模型。</li>
              <li>鼠标右键拖动可以平移模型。</li>
              <li>鼠标滚轮可以缩放模型。</li>
            </ol>
          </div>
        </div>
      </p>
    </div>
  )
}
export default Apphead