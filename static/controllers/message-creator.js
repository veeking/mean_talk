 var createCtrl = angular.module('meanTalk.create.controller',[]);
 createCtrl.controller('MessageCreatorCtrl',function($scope,socket){
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