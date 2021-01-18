(function () {
    window.CHAT = {
        msgObj:document.getElementById("message"),
        username:null,
        userid:null,
        socket:null,
        
        logout:function(){
            //this.socket.disconnect();
            location.reload();
        },
        //提交聊天消息内容
        submit:function(){
            var content = document.getElementById("content").value;
            if(content != ''){
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
                document.getElementById("content").value = '';
            }
            return false;
        },
        //更新系统消息，本例中在用户加入、退出的时候调用
        updateSysMsg:function(o, action){
            //当前在线用户列表
            var onlineUsers = o.onlineUsers;
            //当前在线人数
            var onlineCount = o.onlineCount;
            //新加入用户的信息
            var user = o.user;
 
            //更新在线人数
            var userhtml = '';
            var separator = '';
            for(key in onlineUsers) {
                if(onlineUsers.hasOwnProperty(key)){
                    userhtml += separator+onlineUsers[key];
                    separator = '、';
                }
            }
            document.getElementById("onlinecount").innerHTML = '当前共有 '+onlineCount+' 人在线，在线列表：'+userhtml;
 
            //添加系统消息
            var div = document.createElement('div');
            div.className = "msg-system";
            div.innerHTML = `${user.username}${(action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室'}`
            this.msgObj.appendChild(div); 
        },
        //第一个界面用户提交用户名
        usernameSubmit:function(){
            var username = document.getElementById("username").value;
            if(username != ""){
                document.getElementById("username").value = '';
                document.getElementById("loginbox").style.display = 'none';
                document.getElementById("chatbox").style.display = 'block';
                this.init(username);
            }
            return false;
        },
        init:function(username){
            
            this.userid = new Date().getTime();
            this.username = username;
            document.getElementById("showusername").innerHTML = this.username;
 
            //连接websocket后端服务器,多设备时用ip访问
            this.socket = io.connect('ws://localhost:3000/');
 
            //告诉服务器端有用户登录
            this.socket.emit('login', {userid:this.userid, username:this.username});
 
            //监听新用户登录
            this.socket.on('login', function(o){
                CHAT.updateSysMsg(o, 'login');
            });
 
            //监听用户退出
            this.socket.on('logout', function(o){
                CHAT.updateSysMsg(o, 'logout');
            });
 
            //监听消息发送
            this.socket.on('message', function(obj){
                var section = document.createElement('section');
                section.className = obj.userid == CHAT.userid ? 'user' : 'service';
                section.innerHTML = `<div>${obj.content}</div><span>${obj.username}</span>`;
                
                CHAT.msgObj.appendChild(section);
            });
 
        }
    };
    //通过“回车”提交用户名
    document.getElementById("username").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.usernameSubmit();
        }
    };
    //通过“回车”提交信息
    document.getElementById("content").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };
})();
