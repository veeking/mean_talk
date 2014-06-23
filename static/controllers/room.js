var RoomCtrl = angular.module('meanTalk.room.controller',[]);
RoomCtrl.controller('RoomCtrl',function($scope,socket){
	 socket.on('meantalk.read', function (meantalk) {
    $scope.meantalk = meantalk
  })
  socket.on('messages.add', function (message) {
    $scope.meantalk.messages.push(message)
  })

  socket.emit('meantalk.read')
  
  socket.on('users.add', function (user) {
    $scope.meantalk.users.push(user)
  })

  socket.on('users.remove', function (user) {
    _userId = user._id
    $scope.meantalk.users = $scope.meantalk.users.filter(function (user) {
      return user._id != _userId
    })
  })
});