# 前端开发示例项目

这个项目包含了一系列前端开发示例，涵盖了HTML、CSS、JavaScript和React等技术。

## 项目结构

```
.
├── _config.yml          # Jekyll配置文件
├── _layouts/            # Jekyll布局模板
│   └── default.html     # 默认布局
├── BASIC/               # 基础示例目录
│   ├── 基础布局示例.html
│   ├── ES6特性示例.html
│   ├── flex布局演示.html
│   ├── 网格布局演示.html
│   ├── React虚拟DOM详解.html
│   ├── 视频播放器.html
│   └── 乒乓球游戏/
├── FCC/                 # FCC课程项目目录
│   ├── CSS/             # CSS项目
│   ├── HTML/            # HTML项目
│   ├── JS/              # JavaScript项目
│   └── REACT/           # React项目
├── src/                 # 资源文件目录
│   ├── audio/           # 音频文件
│   └── meida/           # 媒体文件
├── test/                # 测试文件目录
├── index.html           # 首页
├── styles.css           # 样式文件
├── script.js            # JavaScript文件
└── README.md            # 项目说明文件
```

## 本地运行

1. 确保已安装Ruby和Jekyll：
   ```bash
   gem install jekyll bundler
   ```

2. 安装项目依赖：
   ```bash
   bundle install
   ```

3. 在本地启动Jekyll服务器：
   ```bash
   bundle exec jekyll serve
   ```

4. 在浏览器中打开 `http://localhost:4000` 查看项目。

## 部署到GitHub Pages

1. 将代码推送到GitHub仓库的`main`分支。

2. 在GitHub仓库的Settings → Pages中，将Source设置为"GitHub Actions"。

3. GitHub Actions工作流将自动触发，将站点部署到GitHub Pages。

## 技术栈

- HTML5
- CSS3
- JavaScript ES6+
- React

## 许可证

MIT