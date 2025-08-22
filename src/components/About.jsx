import React from 'react'

function About() {
  return (
    <div className="page">
      <div className="card">
        <h1>关于这个项目</h1>
        <p>
          这是一个使用 React + Vite 构建的静态网站，专门为 GitHub Pages 部署而设计。
          项目展示了如何创建一个现代化的 React 应用并将其部署到 GitHub Pages 上。
        </p>
      </div>

      <div className="card">
        <h2>技术栈</h2>
        <div className="features">
          <div className="feature">
            <h3>前端框架</h3>
            <p>React 18 - 现代化的用户界面库</p>
          </div>
          <div className="feature">
            <h3>构建工具</h3>
            <p>Vite - 快速的前端构建工具</p>
          </div>
          <div className="feature">
            <h3>路由管理</h3>
            <p>React Router - 声明式路由</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>部署流程</h2>
        <p>本项目使用 GitHub Actions 实现自动化部署：</p>
        <ol>
          <li>当代码推送到 main 分支时触发工作流</li>
          <li>安装依赖并运行构建命令</li>
          <li>将构建结果部署到 gh-pages 分支</li>
          <li>GitHub Pages 自动发布更新的网站</li>
        </ol>
      </div>

      <div className="card">
        <h2>项目结构</h2>
        <pre style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`src/
├── components/         # React 组件
│   ├── Home.jsx       # 首页组件
│   ├── About.jsx      # 关于页面
│   └── Contact.jsx    # 联系页面
├── App.jsx            # 主应用组件
├── App.css            # 样式文件
├── main.jsx           # 应用入口点
└── index.css          # 全局样式

.github/workflows/     # GitHub Actions 配置
public/               # 静态资源
vite.config.js        # Vite 配置文件
package.json          # 项目依赖配置`}
        </pre>
      </div>
    </div>
  )
}

export default About