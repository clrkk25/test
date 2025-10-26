# Supabase 简单连接示例

这个目录包含了使用C++连接Supabase数据库的简单示例。

## 文件说明

- `supabase_client_simple.cpp`: 简化版的Supabase客户端实现
- `compile_simple.bat`: 编译简化版客户端的批处理脚本
- `supabase_demo.cpp`: 完整的使用示例程序
- `supabase_commands.sql`: 在Supabase中创建表和插入数据的SQL命令

## 使用步骤

1. 在Supabase中执行 `supabase_commands.sql` 中的SQL命令创建表和插入数据
2. 修改 `supabase_demo.cpp` 中的Supabase URL和API密钥
3. 使用 `compile_simple.bat` 编译程序
4. 运行生成的可执行文件

## SQL命令

```sql
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
```