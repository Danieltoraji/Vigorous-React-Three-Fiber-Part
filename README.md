# 衡有锦深！——3D部分源码
## 关于
这里将会是我们的Web3D部分的源代码。（当然目前还没有，我刚刚从Create App转到Vite）
我们的主项目中看到的Web3D部分其实是编译后的，因此需要将编译前的源代码开一个仓库，放在这里。
## 技术路线
我们使用的Web3D技术是Three.js。使用React框架构建前端。我们使用React-three-fiber作为threejs的React渲染器。
使用Vite作为前端构建工具。在用来开发的电脑上，使用yarn进行包管理（当然我个人觉得npm也可以）。
## 本项目的创建、开发
本项目的创建依赖于以下命令：
`yarn create vite`
创建时参数：React, JavaScript, no use rolldown-vite.
添加包：
`yarn add three @types/three @react-three/fiber`
运行本地开发服务器，请在vite-project使用`yarn dev`
## 和主项目的关系
和一般的React项目一样，本项目在交付生产时要进行打包。`yarn run build`
打包后生成的静态文件将会被拷贝到主项目的/static文件夹中，再从其他.html文件中进行引用，在urls.py，views.py中进行路由与视图的配置。
打包和同步到主项目的过程，似乎可以由钉小呆来干...？
**祝开发愉快！**