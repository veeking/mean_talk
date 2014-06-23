   var service = angular.module('meanTalk.service',[]);
   service.factory('socket',function($rootScope){ //将socket服务封装成一个抽象angular服务组件，使其可以重用
   		var socket = io.connect('/');
   		return {
   		  on : function(eventName,callback){  //callback主要的作用是 接收完事件后进行调用，而且带有参数调用，参数是使事件返回的值
   		  	   socket.on(eventName,function(){
   		  	   		var args = arguments;   // args -- > eventName，function(){}
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
