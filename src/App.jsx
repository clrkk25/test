import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">React GitHub Pages</h1>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">首页</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">关于</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">联系</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2023 React GitHub Pages App. 部署在 GitHub Pages 上。</p>
      </footer>
    </div>
  )
}

export default App