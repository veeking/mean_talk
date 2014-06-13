 var express = require('express');
 var app = express();
 var port = process.env.PORT || 3000;

  app.use(express.static(__dirname + '/static'));
  app.use(function(req,res){
  		 res.sendfile('./static/index.html');
  });
  var io = require('socket.io').listen(app.listen(port));

  var messages = [];  //  将消息暂存到缓存里
  io.sockets.on('connection',function(socket){
  	   socket.on('getAllMessages',function(){
  	     socket.emit('allMessages',messages);				
  	   });
	   socket.on('createMessage',function(message){
	   	 messages.push(message);
  	     io.sockets.emit('messageAdded',message);				
  	   });
 
  });
  console.log('app is runing' + port);
