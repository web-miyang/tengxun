// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLocalStorage from 'vue-localstorage'
import DataCenter from './lib/DataCenter'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts' //引入echarts
import 'echarts/map/js/china.js'
import address from '../static/address.json'
import html2canvas from 'html2canvas'
import htmlToPdf from './lib/htmlToPdf.js'
import xlsx from 'xlsx'
import 'lib-flexible/flexible'
import getChartOption from './lib/chart.js'
Vue.use(htmlToPdf)
Vue.use(getChartOption)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueLocalStorage)
Vue.prototype.$axios = axios;
//Vue.prototype.Link = 'http://tx.yf.test.laipao8.cn/';
//Vue.prototype.Link = 'http://tx.jxd.test.laipao8.cn/';
Vue.prototype.Link = 'https://crm.sports.qq.com/public/index.php/';
Vue.prototype.qs = qs;
var VueCookie = require('vue-cookie')
// Tell Vue to use the plugin
Vue.use(VueCookie)
Vue.prototype.$datacenter = DataCenter
Vue.use(router)
Vue.prototype.post = function(url, data, success_fun, err_fun) {            
	var token = Vue.prototype.$datacenter.getData("token");
	if(token!=undefined){
		data['token'] = token;
	}
	axios.post(Vue.prototype.Link + url, qs.stringify(data))
		.then(function(data_) {
			if(data_.data.data==201001){
				router.push({path: '/login'});
				return;
			}else{
				success_fun(data_);
			}
		})
		.catch(function(error) {
			err_fun(error)
		});
}
Vue.prototype.$echarts = echarts //引入组件
Vue.prototype.$city = address.city
Vue.prototype.$area = address.district
Vue.prototype.$province = address.province
Vue.prototype.html2canvas = html2canvas
Vue.prototype.$xlsx = xlsx
/* eslint-disable no-new */
new Vue({
	el: '#app',
	VueLocalStorage,
	router,
	components: {
		App
	},
	template: '<App/>'
})
