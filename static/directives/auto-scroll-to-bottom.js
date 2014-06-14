 var autoScroll = angular.module('meanTalk.scroll.directive',[]);
 autoScroll.directive('autoScrollToBottom',function(){
      return {
         link : function(scope,element,attrs){
            scope.$watch(function(){
                return element.children().length; // 监听消息列表的长度(数量)
              },function(){
                jQuery(element).animate({ //滚动并带有动画过渡 , angular自带动画组件
                     scrollTop : element.prop('scrollHeight') // 一旦列表长度发生变化，马上滚动到底部scrollHeight就是滚动条的总长度也就是滚动到底部.  
                  },1000);
              });
         }   
      } // end return
 });
