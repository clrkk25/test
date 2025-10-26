@echo off
echo 正在编译简化版supabase客户端...

REM 检查是否存在g++编译器
where g++ >nul 2>&1
if %errorlevel% neq 0 (
    echo 未找到g++编译器。请安装MinGW或Visual Studio。
    pause
    exit /b 1
)

REM 编译简化版supabase客户端
g++ -o supabase_client_simple.exe supabase_client_simple.cpp -lws2_32

if %errorlevel% equ 0 (
    echo 编译成功！生成的可执行文件：supabase_client_simple.exe
    echo.
    echo 要运行程序，请使用以下命令：
    echo supabase_client_simple.exe
) else (
    echo 编译失败！
)

pause