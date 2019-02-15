import Vue from 'vue'

var THREE = require('three');
const DataCenter = {};
var sys_data = null;
var self = new Vue();

var temp_data = {}
var temp_data_time = {}

function init() {
  if (sys_data == null) {
    var sysData = self.$cookie.get('sys_data');
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

DataCenter.getTempData = function (name) {
  return temp_data[name];
};
DataCenter.getTempDataTime = function (name) {
  if (temp_data_time[name] == null) {
    return 0;
  }
  return temp_data_time[name];
};

DataCenter.setData = function (name, data) {
  console.log(name)
  init(self);
  sys_data[name] = data;
  self.$cookie.set('sys_data', JSON.stringify(sys_data));
};

DataCenter.getData = function (name) {
  init();
  return sys_data[name];
};

DataCenter.clear = function () {
  self.$cookie.delete('sys_data');
};

var Textures = []
var Texturesbyname = {}
DataCenter.addTexture = function (t, url) {
  //创建材质
  var material = new THREE.MeshBasicMaterial({map: t});
  Textures.push(material)
  Texturesbyname[url] = material
};
DataCenter.clearTextures = function () {
  Textures = [];
};
DataCenter.getMaterials = function () {
  return Textures;
};

DataCenter.getMaterialsByName = function (name) {
  return Texturesbyname[name];
};
export default DataCenter;
