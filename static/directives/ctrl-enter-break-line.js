 var autoScroll = angular.module('meanTalk.enter.directive',[]);
 autoScroll.directive('ctrlEnterBreakLine',function(){
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

