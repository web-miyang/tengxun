import axios from 'axios'
import Vue from 'vue'

var vue = new Vue();

function ajax() {
}

function postData(data, isloading) {
  isloading = isloading == null ? true : isloading;
  this.data = data;
  this.isloading = isloading;
}

var __prototype = ajax.prototype;
__prototype.post = function (url, data, isloading) {
  // data = JSON.stringify(data)
  let table = new postData(data, isloading);
  if (table.isloading) {
  }
  var _this = this;
  // let gameuser = vue.$datacenter.getData("sys_gameuser");
  // if (gameuser) {
  //   data.sys_userId = gameuser.id;
  // }
  // let sys_mainId = vue.$datacenter.getData("sys_mainId");
  // if (sys_mainId) {
  //   data.sys_mainId = sys_mainId;
  // }
  data.bigscreen_id = 1
  axios.post(url + "?XDEBUG_SESSION_START=17638", data)
    .then(function (response) {
      var data = response.data;
      if (data.code == 200) {
        table.thenfun(data)
      }
      else {
        // 显示
        vue.$message(data.msg);
        // vue.$vux.toast.show({
        //   text: "111111",
        // })
      }
    })
    .catch(function (error) {
      if (table.catchfun) {
        table.catchfun(error)
      }
    })
  return table;
}

__prototype.get = function (url, data, isloading) {

}

postData.prototype.then = function (fun) {
  this.thenfun = fun
  return this;
}

postData.prototype.catch = function (fun) {
  this.catchfun = fun
  return this;
}




export default ajax
