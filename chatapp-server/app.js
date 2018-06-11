var express = require('express');
var path = require('path');
var IO = require('socket.io');
var http = require('http');
var qs = require('querystring');
var router = express.Router();
var port = 3000;
var app = express();
var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 创建socket服务
var socketIO = IO(server, {path:'/chatroomapp'});
// 房间用户名单
var roomInfo = {};

socketIO.on('connection', function (socket) {
  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  var url = socket.request.headers.referer;
  var splited = url.split('/');
  var roomID = splited[splited.length - 1];   // 获取房间ID
  var user = '';
  var eid = '';
  var user_eid = '';

  socket.on('join', function (userName, id) {
      user = userName;
      eid = id;
      user_eid = userName + '#' + id ;

      // 将用户昵称加入房间名单中
      if (!roomInfo[roomID]) {
        roomInfo[roomID] = [];
      };


      console.log(roomInfo[roomID].indexOf(user_eid));
      if(roomInfo[roomID].indexOf(user_eid) == -1){
        roomInfo[roomID].push(user_eid);
        socket.join(roomID);    // 加入房间
        // 通知房间内人员
        socketIO.to(roomID).emit('sys', user_eid + '加入了房间', roomInfo[roomID]); 
        console.log(user_eid + '加入了房间'); 
      }else{
        console.log('22222222222222');
        socket.join(roomID);    // 加入房间
        socketIO.to(roomID).emit('sys', user_eid + '加入了房间', roomInfo[roomID]); 
        console.log(roomInfo[roomID]);
      }
      
  });

  socket.on('leave', function () {
    socket.emit('disconnect');
  });
  //定义断开链接方法
  socket.on('disconnect', function () {
    // 从房间名单中移除
    var index = roomInfo[roomID].indexOf(user_eid);
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1);
    }

    socket.leave(roomID);    // 退出房间
    socketIO.to(roomID).emit('sys', user_eid + '退出了房间', roomInfo[roomID]);
    console.log(user_eid + '退出了' + roomID);
  });

  // 接收用户消息,发送相应的房间
  socket.on('message', function (msg) {
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user_eid) === -1) {  
      return false;
    }
    socketIO.to(roomID).emit('msg', user_eid, msg);
    //console.log(user + '在房间'+roomID+'发出了消息'+msg);

    var ArrayRoomID = roomID.split('_');
    //这是需要提交的数据
    var data = {  
      method: 'sendmessage_node',  
      cid: ArrayRoomID[1],
      eid: eid,
      userName: user,
      messageval: msg
    };  

    var content = qs.stringify(data); 
    var options = {  
        hostname: 'www.mooc.mtn',  
        port: '80',
        path: '/mooc/channelChatRoomServlet',  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
        }   
    };  
      
    var req = http.request(options, function (res) {  
        console.log('STATUS: ' + res.statusCode);  
        console.log('HEADERS: ' + JSON.stringify(res.headers));  
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) {  
            console.log('BODY: ' + chunk);  
        });  
    });  
      
    req.on('error', function (e) {  
        console.log('problem with request: ' + e.message);  
    }); 

    // write data to request body  
    req.write(content); 
    req.end();
  });

});

// room page
router.get('/room/:roomID', function (req, res) {
  var roomID = req.params.roomID;

  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomID: roomID,
    users: roomInfo[roomID]
  });
});

app.use('/', router);

server.listen(port, function () {
  console.log('server listening on port 3000');
});
