/*
 * 通用加载控件
 * 作者：orix
 * 时间：20171215
 */

import './UIProgressHUD.css'

(function($) {
  //给窗口添加滚动事件，在滚动时遮罩跟着元素移动
  $(window).bind("scroll",function() {
    var masks = $(".mask");
    for (var i = 0; i < masks.length; i++) {
      var ele_id = $(masks[i]).attr("ele");
      var eleTop= $(ele_id).offset().top;
      var gun = $(document).scrollTop();
      var top = eleTop-gun;
      $(masks[i]).css({
        "top": top+'px'
      });
    }
  });

  // timeout cache
  var cache = {};
  // 加载动画
  var loadingAni = '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>' +
    '</svg>';

  /*
     * 全屏的loading
     */
  $.mask_fullscreen = function(title, timeout){
    if($(".mask[ele=full_screen]").length > 0){
      return;
    }

    // 禁止滚动
    // $("body,html").addClass("scroll-off");
    var mask = '<div class="mask" ele="full_screen"><div class="hudBox">'+loadingAni+(title==undefined?'':'<div class="hudTitle">'+title+'</div>')+'</div></div>';
    $("body").append(mask);
    clearTimeout(cache["full_screen"]);
    if(timeout && timeout > 0){
      var s = setTimeout(function(){
        $(".mask[ele=full_screen]").remove();
        $("body,html").removeClass("scroll-off");
      }, timeout);
      cache["full_screen"] = s;
    }
  }

  /*
   * 指定元素的loading
  */
  $.mask_element = function(title, ele_id, timeout){
    //判断当前元素是否已经添加遮罩，如果已添加，则直接返回
    if($(".mask[ele="+ele_id+"]").length > 0){
      return;
    }
    //添加遮罩元素
    var mask = '<div class="mask" ele='+ele_id+' style="width: '+$(ele_id).width()+'px !important; height: '+$(ele_id).height()+'px !important; left: '+$(ele_id).offset().left+'px !important; top: '+$(ele_id).offset().top+'px !important;"><div class="hudBox">'+loadingAni+(title==undefined?'':'<div class="hudTitle">'+title+'</div>')+'</div></div>';
    $("body").append(mask);
    clearTimeout(cache[ele_id]);
    if(timeout && timeout > 0){
      var s = setTimeout(function(){
        $(".mask[ele="+ele_id+"]").fadeOut(300, function () {
          this.remove();
        });
      }, timeout);
      cache[ele_id] = s;
    }
  }

  /*
   * close certain loading mask
   */
  $.mask_close = function(ele_id){
    if (ele_id != undefined) {
      $(".mask[ele="+ele_id+"]").remove();
    } else {
      $.mask_close_all();
    }
  }

  /*
   * close all loading mask
   */
  $.mask_close_all = function(){
    $(".mask").remove();
    // $("body,html").removeClass("scroll-off");
  }
})(jQuery);

var UIProgressHUD = {};

/**
 * 注意以下的HUD如果不传，那么无限时间加载，直到你调用了关闭函数
 * 加载的element传jquery的类型，id是#，class是.
 */
UIProgressHUD.show = function (title, timeout) {
  $.mask_fullscreen(title, timeout);
  console.log("显示加载框"+timeout);
}

UIProgressHUD.showInElement = function (title, elementId, timeout) {
  $.mask_element(title, elementId, timeout);
  console.log("显示加载框"+timeout+"到"+elementId);
}

UIProgressHUD.close = function (elementId) {
  $.mask_close(elementId);
  console.log("关闭单个HUD");
}

export default UIProgressHUD
