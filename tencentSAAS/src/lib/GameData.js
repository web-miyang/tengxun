import Vue from 'vue'


var self = new Vue();
var GameData = {};
GameData.TAG_RANK = "SYS_RANK"; //排名
GameData.TAG_ADVERT = "TAG_ADVERT"; // 广告
GameData.TAG_WEATHER = "TAG_WEATHER"; // 天气
GameData.TAG_RUNRANK = "TAG_RUNRANK"; //  本周智能步道运动排行
// GameData.TAG_
//存储数据的地方
var savedata = [];
//队伍的数据

//存储所有的监听器
var sys_listeners = [];

var idindex = 1;
//添加监听器（作用域  监听的数据的名字  回调的方法）
GameData.addListener = function (lthis, dataname, callback) {
  idindex++;
  //把这个监听器 添加到监听器队列
  sys_listeners.push({
    id: idindex,
    name: dataname,
    fun: callback,
    lthis: lthis
  })
  //看看现在有没有数据
  let data = savedata[dataname];
  //如果有 直接回调一次
  if (data != null) {
    callback.apply(lthis, [data]);
  }
  return idindex;
}

//删除监听器
GameData.removeListener = function (id) {
  for (var index in sys_listeners) {
    if (sys_listeners[index].id == id) {
      sys_listeners.splice(index, 1);
      break;
    }
  }
}

//删除自己的
GameData.removeMyListener = function (lthis) {
  for (var index = sys_listeners.length; --index >= 0;) {
    if (sys_listeners[index].lthis == lthis) {
      sys_listeners.splice(index, 1);
    }
  }

}

//判断有没有某个事件的监听
function hasListener(name) {
  for (var index in sys_listeners) {
    if (sys_listeners[index].name == name) {
      return true;
    }
  }
  return false;
}

//notify 通知某个名字的监听器 数据发生了改变
function NotifyDataChange(tag) {
  let data = savedata[tag];
  if (data == null) {
    return;
  }
  for (var index in sys_listeners) {
    if (sys_listeners[index].name == tag) {
      sys_listeners[index].fun.apply(sys_listeners[index].lthis, [data]);
    }
  }
}

GameData.TIMERS = {};
GameData.UPATAETIME = {};
GameData.UPATAETIME[GameData.TAG_RANK] = 1000;
GameData.UPATAETIME[GameData.TAG_ADVERT] = 20000;
GameData.UPATAETIME[GameData.TAG_WEATHER] = 20000;
GameData.UPATAETIME[GameData.TAG_RUNRANK] = 20000;

for (var key in GameData.UPATAETIME) {
  GameData.TIMERS[key] = 0;
}
GameData.updateNow = function () {
  for (var key in GameData.UPATAETIME) {
    GameData.TIMERS[key] = 0;
  }
}
//主消息循环
GameData.messageLoop = function () {
  for (var key in GameData.TIMERS) {
    GameData.TIMERS[key] -= 20;
  }
  if (GameData.TIMERS[GameData.TAG_RANK]<0) {
    //排行数据
    //排行数据
    self.$ajax.post(self.Link + 'runway/big_screen/getnowshowdata', {}, false).then(function (data) {

      savedata[GameData.TAG_RANK] = data.data
      NotifyDataChange(GameData.TAG_RANK)
    })
  }

  //广告数据
  if (GameData.TIMERS[GameData.TAG_ADVERT]<0) {
    //请求广告数据
    self.$ajax.post(self.Link + 'runway/big_screen/getadvertisementlist', {}, false).then(function (data) {
      savedata[GameData.TAG_ADVERT] = data.data
      NotifyDataChange(GameData.TAG_ADVERT)
    })

  }

  // getweather
  //天气数据
  if (GameData.TIMERS[GameData.TAG_WEATHER]<0) {
    //请求天气数据
    self.$ajax.post(self.Link + 'runway/big_screen/getweather', {}, false).then(function (data) {
      savedata[GameData.TAG_WEATHER] = data
      NotifyDataChange(GameData.TAG_WEATHER)
    })

  }

  // getRank
  //排行榜数据
  if (GameData.TIMERS[GameData.TAG_RUNRANK]<0) {
    //请求排行榜数据
    self.$ajax.post(self.Link + 'runway/big_screen/getRank', {}, false).then(function (data) {
      savedata[GameData.TAG_RUNRANK] = data
      NotifyDataChange(GameData.TAG_RUNRANK)
    })

  }
  for (var key in GameData.TIMERS) {
    if (GameData.TIMERS[key] < 0) {
      GameData.TIMERS[key] = GameData.UPATAETIME[key];
    }
  }
}

GameData.clean = function () {
  savedata = [];
}

export default GameData;
