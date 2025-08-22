import React, { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('这是一个演示表单，实际项目中您需要连接到后端服务！')
    console.log('表单数据:', formData)
  }

  return (
    <div className="page">
      <div className="card">
        <h1>联系我们</h1>
        <p>
          有任何问题或建议吗？我们很乐意听到您的声音！
          请填写下面的表单或通过其他方式联系我们。
        </p>
      </div>

      <div className="card">
        <h2>发送消息</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              邮箱 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              消息 *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" className="btn">
            发送消息
          </button>
        </form>
      </div>

      <div className="card">
        <h2>其他联系方式</h2>
        <div className="features">
          <div className="feature">
            <h3>📧 邮箱</h3>
            <p>your-email@example.com</p>
          </div>
          <div className="feature">
            <h3>🐙 GitHub</h3>
            <p>
              <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
                github.com/your-username
              </a>
            </p>
          </div>
          <div className="feature">
            <h3>🌐 网站</h3>
            <p>
              <a href="https://your-website.com" target="_blank" rel="noopener noreferrer">
                your-website.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>项目贡献</h2>
        <p>
          如果您想为这个项目做出贡献，欢迎：
        </p>
        <ul>
          <li>提交 Issue 报告问题或建议新功能</li>
          <li>提交 Pull Request 改进代码</li>
          <li>改进文档和示例</li>
          <li>分享您的使用经验</li>
        </ul>
        <p>
          <a href="https://github.com/your-username/repository-name" className="btn" target="_blank" rel="noopener noreferrer">
            访问 GitHub 仓库
          </a>
        </p>
      </div>
    </div>
  )
}

export default Contact