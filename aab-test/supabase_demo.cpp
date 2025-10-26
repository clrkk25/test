#include <iostream>
#include <string>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

class SimpleHttpClient {
private:
    WSADATA wsaData;
    bool initialized;

public:
    SimpleHttpClient() : initialized(false) {
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) == 0) {
            initialized = true;
        }
    }

    ~SimpleHttpClient() {
        if (initialized) {
            WSACleanup();
        }
    }

    bool isInitialized() const {
        return initialized;
    }

    std::string sendGetRequest(const std::string& host, const std::string& path, const std::string& apiKey) {
        if (!initialized) {
            return "WSAStartup failed";
        }

        // 创建socket
        SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock == INVALID_SOCKET) {
            return "Socket creation failed";
        }

        // 解析主机名
        struct addrinfo hints, *result = nullptr;
        ZeroMemory(&hints, sizeof(hints));
        hints.ai_family = AF_INET;
        hints.ai_socktype = SOCK_STREAM;
        hints.ai_protocol = IPPROTO_TCP;

        if (getaddrinfo(host.c_str(), "443", &hints, &result) != 0) {
            closesocket(sock);
            return "GetAddrInfo failed";
        }

        // 连接服务器
        if (connect(sock, result->ai_addr, (int)result->ai_addrlen) == SOCKET_ERROR) {
            freeaddrinfo(result);
            closesocket(sock);
            return "Connection failed";
        }

        freeaddrinfo(result);

        // 构造HTTP请求
        std::string request = "GET " + path + " HTTP/1.1\r\n";
        request += "Host: " + host + "\r\n";
        request += "apikey: " + apiKey + "\r\n";
        request += "Authorization: Bearer " + apiKey + "\r\n";
        request += "Connection: close\r\n\r\n";

        // 发送请求
        if (send(sock, request.c_str(), request.length(), 0) == SOCKET_ERROR) {
            closesocket(sock);
            return "Send failed";
        }

        // 接收响应
        std::string response;
        char buffer[4096];
        int bytesReceived;

        while ((bytesReceived = recv(sock, buffer, sizeof(buffer) - 1, 0)) > 0) {
            buffer[bytesReceived] = '\0';
            response += buffer;
        }

        closesocket(sock);
        return response;
    }

    std::string sendPostRequest(const std::string& host, const std::string& path, 
                               const std::string& apiKey, const std::string& jsonData) {
        if (!initialized) {
            return "WSAStartup failed";
        }

        // 创建socket
        SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock == INVALID_SOCKET) {
            return "Socket creation failed";
        }

        // 解析主机名
        struct addrinfo hints, *result = nullptr;
        ZeroMemory(&hints, sizeof(hints));
        hints.ai_family = AF_INET;
        hints.ai_socktype = SOCK_STREAM;
        hints.ai_protocol = IPPROTO_TCP;

        if (getaddrinfo(host.c_str(), "443", &hints, &result) != 0) {
            closesocket(sock);
            return "GetAddrInfo failed";
        }

        // 连接服务器
        if (connect(sock, result->ai_addr, (int)result->ai_addrlen) == SOCKET_ERROR) {
            freeaddrinfo(result);
            closesocket(sock);
            return "Connection failed";
        }

        freeaddrinfo(result);

        // 构造HTTP请求
        std::string request = "POST " + path + " HTTP/1.1\r\n";
        request += "Host: " + host + "\r\n";
        request += "Content-Type: application/json\r\n";
        request += "apikey: " + apiKey + "\r\n";
        request += "Authorization: Bearer " + apiKey + "\r\n";
        request += "Content-Length: " + std::to_string(jsonData.length()) + "\r\n";
        request += "Connection: close\r\n\r\n";
        request += jsonData;

        // 发送请求
        if (send(sock, request.c_str(), request.length(), 0) == SOCKET_ERROR) {
            closesocket(sock);
            return "Send failed";
        }

        // 接收响应
        std::string response;
        char buffer[4096];
        int bytesReceived;

        while ((bytesReceived = recv(sock, buffer, sizeof(buffer) - 1, 0)) > 0) {
            buffer[bytesReceived] = '\0';
            response += buffer;
        }

        closesocket(sock);
        return response;
    }
};

class SupabaseClient {
private:
    std::string supabaseUrl;
    std::string apiKey;
    std::string host;
    std::string basePath;
    SimpleHttpClient httpClient;

public:
    SupabaseClient(const std::string& url, const std::string& key) : 
        supabaseUrl(url), apiKey(key), httpClient() {
        // 简单解析URL获取主机和路径
        // 注意：这是一个简化的解析，实际应用中应该使用更完善的URL解析库
        size_t protocolEnd = url.find("://");
        if (protocolEnd != std::string::npos) {
            protocolEnd += 3;
        } else {
            protocolEnd = 0;
        }
        
        size_t pathStart = url.find("/", protocolEnd);
        if (pathStart != std::string::npos) {
            host = url.substr(protocolEnd, pathStart - protocolEnd);
            basePath = url.substr(pathStart);
        } else {
            host = url.substr(protocolEnd);
            basePath = "";
        }
    }

    bool insertData(const std::string& table, const std::string& jsonData) {
        if (!httpClient.isInitialized()) {
            std::cerr << "HTTP client not initialized" << std::endl;
            return false;
        }

        std::string path = basePath + "/rest/v1/" + table;
        std::string response = httpClient.sendPostRequest(host, path, apiKey, jsonData);
        
        // 简单检查响应是否成功（实际应用中应该解析HTTP状态码）
        if (response.find("201 Created") != std::string::npos || response.find("\"id\"") != std::string::npos) {
            std::cout << "Data inserted successfully!" << std::endl;
            return true;
        } else {
            std::cerr << "Insert failed: " << response << std::endl;
            return false;
        }
    }

    std::string fetchData(const std::string& table) {
        if (!httpClient.isInitialized()) {
            std::cerr << "HTTP client not initialized" << std::endl;
            return "";
        }

        std::string path = basePath + "/rest/v1/" + table;
        std::string response = httpClient.sendGetRequest(host, path, apiKey);
        
        // 简单检查响应是否成功（实际应用中应该解析HTTP状态码）
        if (response.find("200 OK") != std::string::npos) {
            std::cout << "Data fetched successfully!" << std::endl;
            // 返回响应体（实际应用中应该解析HTTP响应）
            size_t bodyStart = response.find("\r\n\r\n");
            if (bodyStart != std::string::npos) {
                return response.substr(bodyStart + 4);
            }
            return response;
        } else {
            std::cerr << "Fetch failed: " << response << std::endl;
            return "";
        }
    }
};

int main() {
    // 请替换为您的Supabase项目URL和API密钥
    std::string supabaseUrl = "https://your-project.supabase.co";
    std::string apiKey = "your-public-anon-key";
    
    SupabaseClient supabase(supabaseUrl, apiKey);
    
    // 插入数据示例
    std::string jsonData = "{\"message\": \"Hello World\"}";
    std::cout << "Inserting data..." << std::endl;
    supabase.insertData("messages", jsonData);
    
    // 获取数据示例
    std::cout << "Fetching data..." << std::endl;
    std::string data = supabase.fetchData("messages");
    std::cout << "Fetched data: " << data << std::endl;
    
    return 0;
}