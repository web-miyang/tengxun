var StyleUtil = {};
/*
* 智能机浏览器版本信息:
*/
var browser = {
  versions: function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {//移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

console.log("语言版本: " + browser.language);
console.log(" 是否为移动终端: " + browser.versions.mobile);
console.log(" ios终端: " + browser.versions.ios);
console.log(" android终端: " + browser.versions.android);
console.log(" 是否为iPhone: " + browser.versions.iPhone);
console.log(" 是否iPad: " + browser.versions.iPad);
console.log(navigator.userAgent);

StyleUtil.BW_TYPE_IOS = 1;
StyleUtil.BW_TYPE_ANDROID = 2;
StyleUtil.BW_TYPE_PC = 3;


StyleUtil.getBrowserType = function () {
  if (browser.versions.ios) {
    return StyleUtil.BW_TYPE_IOS;
  }
  if (browser.versions.android) {
    return StyleUtil.BW_TYPE_ANDROID;
  }
  return StyleUtil.BW_TYPE_PC;
}

StyleUtil.ObjDataToStyle = function (objdata, styleobj) {
  var str = '';
  if (objdata.rotate != null) {
    str += 'rotate(' + objdata.rotate + 'deg) ';
  }
  if (objdata.scaleX != null) {
    str += 'scaleX(' + objdata.scaleX + ') ';
  }
  if (objdata.scaleY != null) {
    str += 'scaleY(' + objdata.scaleY + ') ';
  }
  if (objdata.translate != null) {
    str += 'translate(' + objdata.translate + ') ';
  }



  styleobj.transform = str;
  if (objdata.left != null) {
    styleobj.left = objdata.left + 'px';
  }
  if (objdata.top != null) {
    styleobj.top = objdata.top + 'px';
  }
  if (objdata.bottom != null) {
    styleobj.bottom = objdata.bottom + 'px';
  }
  if (objdata.right != null) {
    styleobj.right = objdata.right + 'px';
  }

  if (objdata.width != null) {
    styleobj.width = objdata.width + 'px';
  }
  if (objdata.height != null) {
    styleobj.height = objdata.height + 'px';
  }
  if (objdata.display != null) {
    styleobj.display = objdata.display;
  }
  if (objdata.opacity != null) {
    styleobj.opacity = objdata.opacity;
  }
}

StyleUtil.getClientHeight = function () {
  var width = document.documentElement.clientWidth;
  var heiht = document.documentElement.clientHeight;
  return Math.floor(heiht * 750 / width);
}

StyleUtil.getClientWidth = function () {
  return 750;
}


export default StyleUtil
