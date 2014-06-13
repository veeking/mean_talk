   angular.module('meanTalkApp',[]);
   angular.module('meanTalkApp').factory('socket',function($rootScope){ //将socket服务封装成一个抽象angular服务组件，使其可以重用
   		var socket = io.connect('/');
   		return {
   		  on : function(eventName,callback){  //callback主要的作用是 接收完事件后进行调用，而且带有参数调用，参数是使事件返回的值
   		  	   socket.on(eventName,function(){
   		  	   		var args = arguments;   // args -- > evnetName，function(){}
   		  	   		$rootScope.$apply(function(){ //  $apply监听并刷新
   		  	   			callback.apply(socket,args);  	
   		  	   		});
   		  	   		
   		  	   })
   		  },// end on
   		  emit : function(eventName,data,callback){
   		  	  	socket.emit(eventName,data,function(){
   		  	  		var args = arguments;
   		  	  		$rootScope.$apply(function(){  
   		  	  			if(callback){
   		  	  				callback.apply(socket,args);	
   		  	  			}	
   		  	  		});
   		  	  	});
   		  }
   		 }  //end return 

   });	

   // Controller
angular.module('meanTalkApp').controller('RoomCtrl',function($scope,socket){
	$scope.messages = [];  // [{},{},{}] ...  
	socket.emit('getAllMessages');
	socket.on('allMessages',function(messages){
		$scope.messages = messages;  //msgData也为[{},{},{}]类型，所以直接作为引用 读取到的messages 写入view列表中
	});
	socket.on('messageAdded',function(message){ 
		$scope.messages.push(message);  //单条数据push
	});
});

angular.module('meanTalkApp').controller('MessageCreatorCtrl',function($scope,socket){
    $scope.newMessage = ''; //  初始化为空
    $scope.createMessage = function(){  //定义按下ctrl+enter后要执行的事件
         if($scope.newMessage == ''){
            alert('不能为空');
            return;
         }
         socket.emit('createMessage',$scope.newMessage);
         $scope.newMessage = ''; 
    }
});
	// var socket = io.connect('/');  //相当于 localhost:3000
	// socket.on('connected',function(){
	// 	console.log('yes');
	// });

//Directive
 angular.module('meanTalkApp').directive('autoScrollToBottom',function(){
      return {
         link : function(scope,element,attrs){
              scope.$watch(function(){
                  return element.children().length; // 监听消息列表的长度(数量)
              },function(){
                  element.animate({ //滚动并带有动画过渡 , angular自带动画组件
                     scrollTop : element.prop('scrollHeight') // 一旦列表长度发生变化，马上滚动到底部scrollHeight就是滚动条的总长度也就是滚动到底部.  
                  },1000);
              });
         }   
      } // end return
 });

  angular.module('meanTalkApp').directive('ctrlEnterBreakLine',function(){
      return function(scope,element,attrs){
          var ctrlDown = false;  //判断是否按下ctrl，用于组合按键
          element.bind('keydown',function(event){
               if(event.which === 17){  //按下ctrl键后，ctrlDown变为true 并在1秒后恢复为false
                    ctrlDown = true;
                   setTimeout(function(){
                     ctrlDown = false;  // 一秒后恢复false，便于下一次触发 
                    },1000);  
               }
               if(event.which === 13){
                  if(ctrlDown){  // 同时按下ctrl和enter键的话,换行
                    element.val(element.val() + '\n');    
                  }else{  // 否则  发送消息
                     scope.$apply(function(){
                        scope.$eval(attrs.ctrlEnterBreakLine);
                     });
                     event.preventDefault();
                  } 
               }  // end if 13
          });
         }   // end function(scope,element,attrs){
 });

