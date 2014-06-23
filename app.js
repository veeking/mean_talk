 var express = require('express');
 var app = express();
 var port = process.env.PORT || 3000;
 var async = require('async');
 var Controllers = require('./controllers');
 //socket 验证
var parseSignedCookie = require('connect').utils.parseSignedCookie;
var MongoStore = require('connect-mongo')(express);
var Cookie = require('cookie');

  var sessionStore = new MongoStore({
      url : 'mongodb://localhost/meantalk'
  });

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret : 'meantalk',
        cookie: {
           maxAge : 60*1000*60
        },
        store : sessionStore
    }));
    app.use(express.static(__dirname + '/static'));

    app.get('/api/validate',function(req,res){  //登录验证服务端接口
      _userId = req.session._userId;
      if(_userId){
        Controllers.User.findUserById(_userId,function(err,user){
          if(err){
            res.json(401,{msg:err});
          } else {
            res.json(user);
          }    
        })
      }else{
          res.json(401,null);
      }
  })

  app.post('/api/login',function(req,res){  // 登录接口
      email = req.body.email;
      if(email){
        Controllers.User.findByEmailOrCreate(email,function(err,user){
           if(err){
              res.json(500,{msg:err});
           } else {
              req.session._userId = user._id;
              Controllers.User.online(user._id,function(err,user){
                 if(err){
                    res.json(500,{msg:err})
                 } else {
                    res.json(user);
                 }   
              });              
           }

        });
      } else {
        res.json(403); 
      }
  });

  app.get('/api/logout',function(req,res){
      _userId = req.session._userId;
      Controllers.User.offline(_userId,function(err,user){
         if(err){
           res.json(500,{msg:err});
         } else {
           res.json(200);
           delete req.session._userId;
         } 
      });
  });

  app.use(function(req,res){
      res.sendfile('./static/index.html');
  });



  var io = require('socket.io').listen(app.listen(port));

  io.set('authorization', function(handshakeData, accept) {  //设置cookie
 
  handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie)
  var connectSid = handshakeData.cookie['connect.sid']
  connectSid = parseSignedCookie(connectSid,'meantalk')   
 
  if (connectSid) {
    sessionStore.get(connectSid, function(error,session) {
      if (error) {
        accept(error.message, false)
      } else {
        handshakeData.session = session
        if (session._userId) {
          accept(null,true)
        } else {
          accept('No login')
        }
      }
    })
  } else {
    accept('No session')
  }
})
  var SYSTEM = {
  name: 'technode机器人',
  avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
}
    // var messages = [];  //  将消息暂存到缓存里
    io.sockets.on('connection',function(socket){
      _userId = socket.request.session._userId 
      Controllers.User.online(_userId,function(err,user){  //上线
          if(err){
            socket.emit('err',{msg:err});
          }else{
            socket.broadcast.emit('online',user);
            socket.broadcast.emit('messages.add',{
               content : user.name + '进入了聊天室房间',
               creator : SYSTEM,
               createAt : new Date()
            });
          }
      });
      socket.on('disconnect',function(){  // 根据socket链接判断下线
          Controllers.User.offline(_userId,function(err,user){
              if(err){
                socket.emit('err',{msg:err});
              } else {
                socket.broadcast.emit('offline',user);
                socket.broadcast.emit('messages.add',{
                   content : user.name + '离开了聊天室',
                   creator : SYSTEM,
                   createAt : new Date()
                });
              }
          });
      });

      socket.on('meantalk.read',function(){
         async.parallel([  //  async.parallel([fun,fun1,fun2...],callback);
            function(done){ 
               Controllers.User.getOnlineUsers(done);
            },
            function(done){
               Controllers.Message.read(done);
            }],
            function(err,results){
              if(err){
                socket.emit('err',{msg:err});
              }else{
                socket.emit('meantalk.read',{
                   users:results[0],
                   messages:results[1]
                }); 
              }
            });
      });
 
         
       socket.on('messages.create',function(message){
        Controllers.Message.create(message,function(err,message){
            if(err){
              socket.emit('err',{msg:err});
            } else {
              
              io.sockets.emit('messages.add',message);   
            }
        });
           // messages.push(message);
           // io.sockets.emit('messageAdded',message);       
         });
   
    });

  
 console.log('app is runing' + port); 
 
  

  