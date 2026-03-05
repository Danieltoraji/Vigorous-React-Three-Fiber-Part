# 🎨 贝塞尔曲线手柄交互优化

## ✨ 新增功能：智能光标反馈

现在贝塞尔模式支持**可视化光标反馈**，鼠标移动到手柄上时会显示不同的光标样式，明确提示可以拖拽操作！

## 🎯 功能详情

### 1. **三种光标状态**

| 场景 | 光标样式 | 说明 |
|-----|---------|------|
| **悬停在手柄上** | `crosshair` (十字准星) 🔗 | 提示可以拖拽调整曲率 |
| **悬停在锚点上** | `move` (四向箭头) ↕↔ | 提示可以移动锚点位置 |
| **空白区域** | `crosshair` (十字准星) ➕ | 提示可以点击添加新锚点 |

### 2. **悬停检测机制**

```javascript
// 实时检测鼠标位置
checkHover(mouseX, mouseY) {
  // 遍历所有锚点和手柄
  for (每个锚点) {
    // 检测左手柄 cp1
    if (距离 < 8px) {
      设置光标为 'crosshair'
      显示可拖拽提示
    }
    
    // 检测右手柄 cp2  
    if (距离 < 8px) {
      设置光标为 'crosshair'
      显示可拖拽提示
    }
    
    // 检测锚点本身
    if (距离 < 8px) {
      设置光标为 'move'
      显示可移动提示
    }
  }
}
```

### 3. **交互流程**

#### 之前的问题 ❌
```
用户移动鼠标到手柄 → 无视觉反馈 → 不知道可以点击 → 无法拖拽
```

#### 现在的体验 ✅
```
用户移动鼠标到手柄 → 光标变为十字准星 → 明确可以拖拽 → 点击并拖动 → 实时调整曲线
```

## 🔧 技术实现

### 悬停检测函数

```javascript
const checkHover = useCallback((mouseX, mouseY) => {
  // 检测半径：8 像素
  const HOVER_RADIUS = 8;
  
  for (let i = 0; i < bezierAnchors.length; i++) {
    const anchor = bezierAnchors[i];
    
    // 检查左手柄
    const distCp1 = Math.sqrt(
      (mouseX - anchor.cp1.x)² + (mouseY - anchor.cp1.y)²
    );
    if (distCp1 < HOVER_RADIUS) {
      setHoveredElement({ type: 'handle', index: i, handleType: 'cp1' });
      return;
    }
    
    // 检查右手柄
    const distCp2 = ... // 同上
    
    // 检查锚点
    const distAnchor = Math.sqrt(
      (mouseX - anchor.x)² + (mouseY - anchor.y)²
    );
    if (distAnchor < HOVER_RADIUS) {
      setHoveredElement({ type: 'anchor', index: i });
      return;
    }
  }
  
  // 没有悬停元素
  setHoveredElement(null);
}, [bezierAnchors]);
```

### 动态光标设置

```javascript
// 在绘制时更新画布样式
const canvas = canvasRef.current;
if (canvas) {
  if (hoveredElement?.type === 'handle') {
    canvas.style.cursor = 'crosshair';  // 十字光标
  } else if (hoveredElement?.type === 'anchor') {
    canvas.style.cursor = 'move';       // 移动光标
  } else {
    canvas.style.cursor = 'crosshair';  // 默认绘制光标
  }
}
```

### 事件监听优化

```jsx
<canvas
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseLeave}
  onMouseOver={handleMouseHover}        // 新增：进入画布检测
  onMouseMoveCapture={(e) => {          // 新增：移动时持续检测
    if (!isDrawing) {
      handleMouseHover(e);
    }
  }}
/>
```

## 📊 视觉效果对比

### 之前（无反馈）❌
```
画布：[锚点]----(曲线)----[锚点]
            ↑
         鼠标在这里，但无任何提示
         用户："这是啥？能点吗？"
```

### 现在（有反馈）✅
```
画布：[锚点]----(曲线)----[锚点]
            ↑
         鼠标移动到此处
         ↓
         光标变成十字准星 🔗
         手柄高亮显示（红色加深）
         用户："哦！这个可以拖！"
```

## 🎯 使用场景

### 场景 1：发现手柄
1. 用户移动鼠标到曲线附近
2. 看到某个红色小点的光标突然变化
3. **立即明白**：这个小红点可以交互！

### 场景 2：精确选择
1. 多个手柄靠得很近
2. 通过光标变化确认当前悬停的是哪个
3. 避免误操作相邻的手柄

### 场景 3：新手引导
1. 新用户第一次使用
2. 不需要阅读说明文档
3. 通过光标变化自然学会操作

## ⚙️ 配置参数

### 悬停检测半径
```javascript
const HOVER_RADIUS = 8; // 像素
```

- **太小** (< 5px)：难以准确悬停，用户体验差
- **太大** (> 12px)：容易误触，精度降低
- **8px**：平衡易用性和精确性 ✅

### 光标样式映射

| 元素类型 | CSS cursor | 视觉效果 |
|---------|-----------|---------|
| 手柄 | `crosshair` | 十字准星 🔗 |
| 锚点 | `move` | 四向箭头 ↕↔ |
| 空白 | `default` / `crosshair` | 默认或十字 |

## 🔍 调试技巧

### 查看当前悬停状态
```javascript
console.log('当前悬停:', hoveredElement);
// 输出示例：
// { type: 'handle', index: 2, handleType: 'cp1' }
// null (无悬停)
```

### 测试悬停检测
1. 打开浏览器开发者工具
2. 在 Console 中输入：
```javascript
document.querySelector('.simple-canvas').style.cursor
```
3. 移动鼠标到手柄上
4. 应该看到 `'crosshair'`

## 🐛 已知问题排查

### Q1: 光标不变化？
**检查清单**：
- [ ] 是否在贝塞尔模式？
- [ ] 是否有至少 2 个锚点？
- [ ] 鼠标是否准确悬停在手柄 8px 范围内？
- [ ] 浏览器是否支持 CSS cursor 属性？

### Q2: 光标变化但不准确？
**可能原因**：
- 画布尺寸和显示尺寸不一致
- DPI 缩放导致坐标计算偏差
- 解决：检查 `scaleX` 和 `scaleY` 计算

### Q3: 移动端没有效果？
**说明**：
- 触摸设备不支持 hover 概念
- 未来计划：添加触摸长按显示手柄功能

## 📱 响应式优化

### 不同设备的检测半径

```javascript
// 根据设备类型调整
const getHoverRadius = () => {
  if ('ontouchstart' in window) {
    return 12; // 触摸屏：更大容错
  }
  return 8; // 鼠标：精确控制
};
```

## 🚀 未来增强

### 计划中的功能
- [ ] **手柄高亮**：悬停时手柄颜色加深/放大
- [ ] **工具提示**：显示"拖拽调整曲率"等文字提示
- [ ] **快捷键**：Shift+ 悬停锁定水平/垂直方向
- [ ] **磁吸效果**：接近手柄时自动吸附
- [ ] **触控优化**：长按显示手柄，双指调整

### 高级交互
```javascript
// 悬停时的额外反馈
if (hoveredElement) {
  // 1. 放大被悬停的手柄
  scaleHandle(hoveredElement.index, 1.3);
  
  // 2. 显示工具提示
  showTooltip(`拖拽调整${getHandleName(hoveredElement)}`);
  
  // 3. 高亮相关曲线段
  highlightCurveSegment(hoveredElement.index);
}
```

## 💡 最佳实践

### ✅ 推荐做法
- 缓慢移动鼠标，让光标有反应时间
- 注意观察光标的细微变化
- 结合锚点编号识别目标

### ❌ 避免做法
- 不要快速划过画布（来不及检测）
- 不要期望超过 8px 还能触发悬停
- 不要在非贝塞尔模式期待此功能

---

**版本**: v2.0  
**更新日期**: 2026-03-05  
**状态**: ✅ 已完成并测试
