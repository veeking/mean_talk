  var router = angular.module('meanTalkApp',['ngRoute','meanTalk.room.controller','meanTalk.create.controller','meanTalk.service','meanTalk.scroll.directive','meanTalk.enter.directive']);
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