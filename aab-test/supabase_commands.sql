-- 创建messages表
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 插入"Hello World"数据
INSERT INTO messages (message) VALUES ('Hello World');

-- 查询所有数据
SELECT * FROM messages;