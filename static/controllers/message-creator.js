 var createCtrl = angular.module('meanTalk.create.controller',[]);
 createCtrl.controller('MessageCreatorCtrl',function($scope,socket){
    // $scope.newMessage = ''; //  初始化为空  
   $scope.createMessage = function () {
    socket.emit('messages.create', {
      content: $scope.newMessage,
      creator: $scope.me
    })
    $scope.newMessage = ''
  }
});