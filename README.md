# nodejs-websocket
- 即时通信
    - 服务端
        - index.js是支持ws通信的代码（服务端代码），监听3000端口（此端口在客户端脚本要使用，可以用ip:3000访问）
    - 客户端
        - index.html是聊天室的html静态页面
        - client.js是客户端连接ws通信的js脚本，socket.io.js是支持socket.io客户端的js
        - app.js是搭建客户端访问网页的代码，监听8080端口
    
- 开启客户端和服务端的项目,通过域名+端口 或者 ip + 端口访问
    - node server.js
    - node app.js