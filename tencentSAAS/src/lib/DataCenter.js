import Vue from 'vue'
const SYS_KEY = 'bd_q_sys_data';
const DataCenter = {};
var sys_data = null;
var self = new Vue();

var temp_data = {}
var temp_data_time = {}

function init() {
  if (sys_data == null) {
    var sysData = localStorage.getItem(SYS_KEY);
    if (sysData != null && sysData.length > 0) {
      sys_data = JSON.parse(sysData);
    }
    else {
      sys_data = {};
    }
  }
}

DataCenter.setTempData = function (name, data) {
  temp_data[name] = data;
  if (data == null) {
    temp_data_time[name] = 0
  }
  else {
    temp_data_time[name] = new Date().getTime()
  }
};

DataCenter.getTempData = function (name,def) {
  if(temp_data[name]!=null)
  {
    return temp_data[name];
  }
  return def;
};
DataCenter.getTempDataTime = function (name) {
  if (temp_data_time[name] == null) {
    return 0;
  }
  return temp_data_time[name];
};


DataCenter.setData = function (name, data) {
  init(self);
  sys_data[name] = data;


  localStorage.setItem(SYS_KEY, JSON.stringify(sys_data));
};

DataCenter.getData = function (name) {
  init();
  return sys_data[name];
};
DataCenter.clear = function () {
  localStorage.removeItem(SYS_KEY);
};


export default DataCenter;
