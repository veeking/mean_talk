  var router = angular.module('meanTalkApp',['ngRoute','angularMoment','meanTalk.room.controller','meanTalk.create.controller','meanTalk.login.controller','meanTalk.service','meanTalk.scroll.directive','meanTalk.enter.directive']);
  router.config(function($routeProvider,$locationProvider){
  		$locationProvider.html5Mode(true)
  		$routeProvider.
  		when('/',{
  			templateUrl : '/pages/room.html',
  			controller : 'RoomCtrl'
  		}).
  		when('/login',{
  			templateUrl : '/pages/login.html',
  			controller : 'LoginCtrl'
  		}).
  		otherwise({
  			redirectTo : '/login'
  		})
  });

  router.run(function($window,$rootScope,$http,$location){  // Run Block模块，应用启动时第一个执行的模块
    $window.moment.lang('zh-cn');
    $http({
      url : '/api/validate',
      method : 'GET'
    }).success(function(user){
      $rootScope.me = user;
      $location.path('/');    
    }).error(function(data){
       $location.path('/login'); 
    });

    $rootScope.logout = function(){
      $http({
        url : '/api/logout',
        method : 'GET'
      }).success(function(){
        $rootScope.me = null;
        $location.path('/login');
      });
    }
    $rootScope.$on('login',function(evt,me){
      $rootScope.me = me;
    });
  });