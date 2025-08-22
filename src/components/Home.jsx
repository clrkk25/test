import React from 'react'

function Home() {
  return (
    <div className="page">
      <div className="hero">
        <h1>欢迎来到 React GitHub Pages</h1>
        <p>这是一个部署在 GitHub Pages 上的 React 应用示例</p>
        <a href="#features" className="btn">了解更多</a>
      </div>

      <div id="features" className="features">
        <div className="feature">
          <h3>⚡ 快速部署</h3>
          <p>使用 GitHub Actions 自动构建和部署到 GitHub Pages</p>
        </div>
        <div className="feature">
          <h3>🎨 现代化设计</h3>
          <p>响应式设计，支持移动端和桌面端访问</p>
        </div>
        <div className="feature">
          <h3>🚀 高性能</h3>
          <p>基于 Vite 构建，快速的开发和生产构建</p>
        </div>
      </div>

      <div className="card">
        <h2>项目特性</h2>
        <ul>
          <li>✅ React 18 + Vite 开发环境</li>
          <li>✅ React Router 路由管理</li>
          <li>✅ 响应式 CSS 设计</li>
          <li>✅ GitHub Actions 自动部署</li>
          <li>✅ ESLint 代码规范</li>
          <li>✅ 现代化的 UI 组件</li>
        </ul>
      </div>

      <div className="card">
        <h2>快速开始</h2>
        <p>1. Fork 这个仓库到你的 GitHub 账户</p>
        <p>2. 在 Settings > Pages 中启用 GitHub Pages</p>
        <p>3. 修改配置文件中的仓库名称</p>
        <p>4. 推送代码，自动部署！</p>
      </div>
    </div>
  )
}

export default Home