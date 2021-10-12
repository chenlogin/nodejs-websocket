# nodejs-websocket
- 即时通信
    - 服务端
        - server.js是支持ws通信的代码（服务端代码），监听3000端口（此端口在客户端脚本要使用，可以用ip:3000访问）
    - 客户端
        - index.html是聊天室的html静态页面
        - client.js是客户端连接ws通信的js脚本，socket.io.js是支持socket.io客户端的js

    - Socket.IO内置默认事件
        - 服务器端事件
            - io.sockets.on(‘connection’, function(socket) {})：socket连接成功之后触发，用于初始化
            - socket.on(‘message’, function(message, callback) {})：客户端通过socket.send来传送消息时触发此事件，message为传输的消息，callback是收到消息后要执行的回调
            - socket.on(‘anything’, function(data) {})：收到任何事件时触发
            - socket.on(‘disconnect’, function() {})：socket失去连接时触发（包括关闭浏览器，主动断开，掉线等任何断开连接的情况）
        - 客户端事件
            - connect：连接成功
            - connecting：正在连接
            - disconnect：断开连接
            - connect_failed：连接失败
            - error：错误发生，并且无法被其他事件类型所处理
            - message：同服务器端message事件
            - anything：同服务器端anything事件
            - reconnect_failed：重连失败
            - reconnect：成功重连
            - reconnecting：正在重连
            - 事件触发顺序为：connecting->connect；当失去连接时，事件触发顺序为：disconnect->reconnecting（可能进行多次）->connecting->reconnect->connect

- 开启客户端和服务端的项目,通过域名+端口 或者 ip + 端口访问
    - node server.js

- scan.js 扫描相同网段IP，找到可连接的socket服务器
    - node server.js (开启socket服务)
    - node scan.js (扫描同网段可连接的socket)