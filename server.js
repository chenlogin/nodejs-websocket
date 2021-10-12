const express = require('express');
const path = require('path')
const { exec } = require('child_process')
const { getLocalIPv4 } = require('./utils')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//静态资源
app.use(express.static(path.join(__dirname, 'publish')));

//在线用户
let onlineUsers = {}, onlineCount = 0;
 
io.on('connection', function(socket){
     

    console.log("server info:", "====连接成功")

    //监听新用户加入
    //when the client emits 'login', this listens and executes
    socket.on('login', function(obj){
        
        socket.name = obj.userid; 
        //检查在线列表，如果不在里面就加入
        if(!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
         
        //向所有客户端广播用户加入
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        console.log(obj.username + '进入了聊天室');
    });
     
    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {userid:socket.name, username:onlineUsers[socket.name]};
             
            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;
             
            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username + '离开了聊天室');
        }
    });
     
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.username + '说：' + obj.content);
    });
});

server.listen(1700, function(){
    console.log('Server listening at port 1700');
    var cmd = '';
    var ip = getLocalIPv4().address;
    var url = `http://${ ip ? ip : 'localhost' }:1700`;
    
    switch(process.platform){
        case 'wind32':
            cmd = 'start'; break;
        case 'linux':
            cmd = 'xdg-open'; break;
        case 'darwin':
            cmd = 'open'; break;
    }
    exec(cmd + ' ' + url);
});







