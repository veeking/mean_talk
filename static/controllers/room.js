var RoomCtrl = angular.module('meanTalk.room.controller',[]);
RoomCtrl.controller('RoomCtrl',function($scope,socket){
	$scope.messages = [];  // [{},{},{}] ...  
	socket.emit('getAllMessages');
	socket.on('allMessages',function(messages){
		$scope.messages = messages;  //msgData也为[{},{},{}]类型，所以直接作为引用 读取到的messages 写入view列表中
	});
	socket.on('messageAdded',function(message){ 
		$scope.messages.push(message);  //单条数据push
	});
});