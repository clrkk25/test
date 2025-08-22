# React GitHub Pages App

这是一个使用 React + Vite 构建并部署到 GitHub Pages 的静态网站项目。

## 🚀 快速开始

### 本地开发

1. 克隆或下载这个项目
```bash
git clone https://github.com/your-username/repository-name.git
cd repository-name
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中打开 `http://localhost:5173`

### 构建项目

```bash
npm run build
```

构建后的文件将在 `dist` 目录中。

## 📦 部署到 GitHub Pages

### 自动部署（推荐）

1. **Fork 这个仓库** 到你的 GitHub 账户

2. **更新配置**：
   - 修改 `package.json` 中的 `homepage` 字段：
     ```json
     "homepage": "https://your-username.github.io/your-repository-name"
     ```
   - 修改 `vite.config.js` 中的 `base` 配置：
     ```js
     base: process.env.NODE_ENV === 'production' ? '/your-repository-name/' : '/'
     ```
   - 修改 `src/main.jsx` 中的 `basename`：
     ```jsx
     <BrowserRouter basename={import.meta.env.DEV ? '/' : '/your-repository-name/'}>
     ```

3. **启用 GitHub Pages**：
   - 进入仓库的 Settings > Pages
   - Source 选择 "GitHub Actions"

4. **推送代码**：
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **等待部署完成**，然后访问 `https://your-username.github.io/your-repository-name`

### 手动部署

如果你想手动部署：

```bash
npm run deploy
```

这将构建项目并推送到 `gh-pages` 分支。

## 🛠️ 技术栈

- **React 18** - 用户界面库
- **Vite** - 构建工具和开发服务器
- **React Router** - 客户端路由
- **GitHub Actions** - 自动化部署
- **GitHub Pages** - 静态网站托管

## 📁 项目结构

```
src/
├── components/         # React 组件
│   ├── Home.jsx       # 首页组件
│   ├── About.jsx      # 关于页面
│   └── Contact.jsx    # 联系页面
├── App.jsx            # 主应用组件
├── App.css            # 样式文件
├── main.jsx           # 应用入口点
└── index.css          # 全局样式

.github/workflows/     # GitHub Actions 配置
├── deploy.yml         # 部署工作流

public/               # 静态资源
├── vite.svg          # Vite 图标

vite.config.js        # Vite 配置文件
package.json          # 项目依赖配置
```

## 🎨 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 现代化的 UI 界面
- ✅ 多页面路由支持
- ✅ 自动化 CI/CD 部署
- ✅ ESLint 代码质量检查
- ✅ 快速的开发和构建体验

## 🔧 自定义配置

### 修改网站信息

1. 更新 `index.html` 中的标题和元信息
2. 替换 `public/` 目录中的图标文件
3. 修改组件中的内容和样式

### 添加新页面

1. 在 `src/components/` 中创建新组件
2. 在 `src/App.jsx` 中添加路由
3. 在导航菜单中添加链接

### 自定义样式

- 修改 `src/App.css` 中的样式变量
- 添加新的 CSS 类和样式
- 使用 CSS 变量进行主题定制

## 📝 注意事项

1. **仓库名称**：确保在所有配置文件中使用正确的仓库名称
2. **路径配置**：GitHub Pages 的子路径部署需要正确配置 base path
3. **构建输出**：确保构建输出目录是 `dist`
4. **分支设置**：GitHub Actions 会自动管理 `gh-pages` 分支

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**开始构建你的 React GitHub Pages 应用吧！** 🎉