# 衡有锦深！——3D部分源码
## 1 何意味
这里将会是我们的Web3D部分的源代码。
我们的主项目中看到的Web3D部分其实是编译后的，因此需要将编译前的源代码开一个仓库，放在这里。
### 1.1 前端项目架构
- index.html和main.jsx是项目的入口文件。它们负责将我们的访问导向App.jsx。因此，App.jsx是我们的前端项目的核心文件。其在本项目的地位相当于我们写一个.c文件的main函数。因此我们的主要开发都要在App.jsx中进行。
- 为了让App.jsx文件看起来更加清晰，我们会在其它.jsx文件中定义组件，然后在App.jsx中引入并使用它们。每一个.jsx文件都可以对应一个.css文件，用于定义该组件的样式。它们都储存在src/目录下。比如：AppHead目录储存了我们的头部组件，AppBottom目录储存了我们的底部组件。不过这不是我们的主要技术难点。我都是交给AI写的。在这里感谢Trae CN.
### 1.2 技术路线
我们使用的Web3D技术是Three.js。使用React框架构建前端。我们使用React-three-fiber作为threejs的React渲染器。我们还使用了Drei库来辅助我们的开发。
使用Vite作为前端构建工具。在用来开发的电脑上，使用yarn进行包管理（当然我个人觉得npm也可以）。
### 1.3 本项目的创建、开发
本项目的创建依赖于以下命令：
`yarn create vite`
创建时参数：React, JavaScript, no use rolldown-vite.
添加包：
`yarn add three @types/three @react-three/fiber`
运行本地开发服务器，请在vite-project使用`yarn dev`
### 1.4 和主项目的关系
和一般的React项目一样，本项目在交付生产时要进行打包。`yarn run build`
打包后生成的静态文件将会被拷贝到主项目的对应文件夹中，再从其他.html文件中进行引用，在urls.py，views.py中进行路由与视图的配置。
打包和同步到主项目的过程，似乎可以由钉小呆来干...？

## 2 开发指导
### 2.1 正式一点的项目架构
```
vite-project/
├── dist/               # 构建输出目录
│   ├── assets/         # 编译后的静态资源
│   ├── index.html      # 主HTML文件
│   └── vite.svg        # 图标文件
├── public/             # 公共静态文件
├── src/                # 源代码目录
│   ├── AddModelOnLeft/ # 左侧添加模型面板
│   ├── Appbottom/      # 底部组件
│   ├── Apphead/        # 头部组件
│   │   ├── EditProjectInfo/ # 项目信息编辑
│   │   └── ReturnHome/  # 返回主页
│   ├── assets/         # 静态资源
│   ├── context/        # React Context
│   ├── App.jsx         # 主应用组件
│   ├── index.css       # 全局样式
│   ├── main.jsx        # 应用入口
│   └── modelpage.jsx   # 3D模型页面
├── README.md           # 项目说明
├── eslint.config.js    # ESLint配置
├── index.html          # HTML模板
├── package.json        # 项目依赖
└── vite.config.js      # Vite配置
```

## 2.2 核心组件

### 2.2.1 主应用组件 (App.jsx)

### 2.2.2 头部组件 (Apphead.jsx)
- **项目标题**：显示当前项目名称
- **操作按钮**：提供编辑项目信息、查看使用说明等功能
- **头部控制**：支持显示/隐藏头部

### 2.2.3 左侧添加模型面板 (AddModelOnLeft.jsx)
- **模型按钮**：提供球体、长方体、圆柱等基础形状的添加
- **拖拽功能**：支持面板的拖拽和位置调整
- **显示控制**：支持显示/隐藏面板
- **反馈信息**：显示模型创建的成功或失败信息

### 2.2.4 3D模型页面 (modelpage.jsx)
- **3D场景**：使用 Three.js 渲染 3D 场景
- **相机控制**：支持模型的旋转、平移、缩放
- **灯光设置**：提供合适的光照效果
- **模型渲染**：渲染添加的 3D 模型

### 2.2.5 项目信息编辑 (EditProjectInfo.jsx)
- **项目创建**：创建新的 3D 设计项目
- **信息编辑**：编辑现有项目的名称和描述
- 它是AppHead组件的子组件，用于编辑项目信息。

### 2.2.6 项目上下文 (ProjectContext.jsx)
- **状态管理**：管理项目数据的全局状态
- **数据访问**：提供获取和更新项目数据的方法
- **数据同步**：保持前端数据与后端的同步

## 2.3 与后端的通信

- 我们使用fetch API来与后端进行通信。请求的方法主要使用POST。
- 和后端类似，我们也会使用JSON格式来进行数据交换。一般地，先准备一个JSON对象，将需要发送的数据填充到这个对象中。然后将这个对象转换为JSON字符串，作为请求的body。
- 核心 API 调用示例：

### 2.3.1 保存项目

```javascript
fetch('/api/save-project/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  },
  body: JSON.stringify({
    projectId: projectId,
    name: formData.name,
    description: formData.description,
    parameters: projectData?.parameters || {}
  })
})
```

### 2.3.2 添加模型

```javascript
fetch('/api/add-model/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': getCookie('csrftoken')
  },
  body: JSON.stringify({
    operation: '创建形状',
    shape_type: shapeType,
    project_id: projectId,
    parameters: {
      ...getDefaultParameters(shapeType),
      position: { x: 0, y: 0, z: 0 },
      color: '#ffffff'
    },
    timestamp: new Date().toISOString()
  })
})
```

## 2.4 目前来自后端的数据
- 我们已经初步实现了从后端同步项目数据到前端的功能。因此在前端中需要使用项目相关数据时，我们可以直接使用Context中的快捷方法。
- Context提供了一系列便捷方法 :
```
getProjectId() : 获取项目 ID
getProjectName() : 获取项目名称
getProjectDescription() : 获取项目描述
getProjectParameters() : 获取项目参数
getProjectStatus() : 获取项目状态
getProjectCreatedAt() : 获取创建时间
updateProjectData() : 更新项目数据
```
- 这些方法的具体实现可以在src\context\ProjectContext.jsx中找到。

- 使用上述方法的方法：在任何组件中，你都可以通过以下方式访问项目数据：
```javascript
import { useProject } from './context/ProjectContext.jsx';
function MyComponent() {
    const { 
        getProjectId, 
        getProjectName, 
        getProjectDescription,
        getProjectParameters,
        getProjectStatus,
        getProjectCreatedAt,
        projectData,
        updateProjectData
    } = useProject();
    const projectId = getProjectId();
    const projectName = getProjectName();
  // 使用项目数据...
}
```
**最后更新于26.2.12 祝开发愉快！**