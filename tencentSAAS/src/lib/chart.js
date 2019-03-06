import Vue from 'vue'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
export default {
	install(Vue, options) {
		Vue.prototype.$setoption = function(items_, setInfData) {
				var type = setInfData.type;
				var Xrotate = setInfData.Xrotate;
				var items = [];
				var aloneColor = '#4f81bc';
				var colors = ['#4f81bc','#c0504e','#9bbb58','#23b7e5'];
				for(var p in items_) {
					if(items_[p]['name']!=''){
						items.push(items_[p]);
					}
				}
				var setjson = function(jsonData, name) {
					var arr = [];
					for(var p in jsonData) {
						if(jsonData[p][name]!=''){
							arr.push(jsonData[p][name]);
						}
					}
					return arr;
				};
				var setArr = function() {
					var arr = [];
					for(var z = 0; z < mapData.length; z++) {
						var j = mapData[z];
						for(var i = 0; i < items.length; i++) {
							if(items[i].name.indexOf(mapData[z].name) > -1) {
								j['value'] = items[i].value;
							}
						}
						arr.push(j);
					}
					arr.sort(function(a, b) {
						return b.value - a.value
					})
					return arr;
				};
				var sortArr = function(sor) {
					if(items.length > 0) {
						if(sor) {
							return items.sort(function(a, b) {
								return b.value - a.value
							})
						} else {
							return items.sort(function(a, b) {
								return a.value - b.value
							})
						}
					} else {
						return mapData;
					}
				};
				var setShowData = function(axis){
					var value = axis.data.value
					if(value >= 10000){
						value = (value/10000).toFixed(0)+'万';
					}
					return value;
				};
				var mapData = [
				  {
						name: '北京',
						value: 0
					}, {
						name: '天津',
						value: 0
					},
					{
						name: '上海',
						value: 0
					}, {
						name: '重庆',
						value: 0
					},
					{
						name: '河北',
						value: 0
					}, {
						name: '河南',
						value: 0
					},
					{
						name: '云南',
						value: 0
					}, {
						name: '辽宁',
						value: 0
					},
					{
						name: '黑龙江',
						value: 0
					}, {
						name: '湖南',
						value: 0
					},
					{
						name: '安徽',
						value: 0
					}, {
						name: '山东',
						value: 0
					},
					{
						name: '新疆',
						value: 0
					}, {
						name: '江苏',
						value: 0
					},
					{
						name: '浙江',
						value: 0
					}, {
						name: '江西',
						value: 0
					},
					{
						name: '湖北',
						value: 0
					}, {
						name: '广西',
						value: 0
					},
					{
						name: '甘肃',
						value: 0
					}, {
						name: '山西',
						value: 0
					},
					{
						name: '内蒙古',
						value: 0
					}, {
						name: '陕西',
						value: 0
					},
					{
						name: '吉林',
						value: 0
					}, {
						name: '福建',
						value: 0
					},
					{
						name: '贵州',
						value: 0
					}, {
						name: '广东',
						value: 0
					},
					{
						name: '青海',
						value: 0
					}, {
						name: '西藏',
						value: 0
					},
					{
						name: '四川',
						value: 0
					}, {
						name: '宁夏',
						value: 0
					},
					{
						name: '海南',
						value: 0
					}, {
						name: '台湾',
						value: 0
					},
					{
						name: '香港',
						value: 0
					}, {
						name: '澳门',
						value: 0
					},{
						name: '南海诸岛',
						value: 0
					}
				];
				switch(type) {
					case 'bar':
						var option = {
							tooltip: {
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							xAxis: {
								data: setjson(items, 'name'),
								axisLabel: {
									interval: 0,
									rotate: Xrotate
								},
								axisLine: {
									show: false,
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								},
							},
							yAxis: {
								axisLine: {
									show: false,
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								}
							},
							grid: {
								left: '3%',
								right: '5%',
								containLabel: true
							},
							series: [{
								type: 'bar',
								data: items,
								barCategoryGap: '45%',
								itemStyle: {
									normal: {
										label: {
											show: true,
											trigger: 'axis',
											position: 'top',
											formatter: function(axis){
												return setShowData(axis);
											}
										},
										color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
						                    offset: 0,
						                    color: '#c5e8f4' // 0% 处的颜色
						                }, {
						                    offset: 1,
						                    color: aloneColor // 100% 处的颜色
						                }], false)
									}
								}
							}]
						}
						break;
					case 'pctbar':
						var option = {
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									type: 'shadow'
								}
							},
							xAxis: {
								data: setjson(items, 'name'),
								axisLabel: {
									interval: 0,
									rotate: Xrotate
								},
								axisLine: {
									show: false,
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								}
							},
							yAxis: {
								axisLine: {
									show: false,
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								}
							},
							grid: {
								left: '10%',
								containLabel: true
							},
							series: [{
								type: 'bar',
								data: items,
								barCategoryGap: '45%',
								itemStyle: {
									normal: {
										label: {
											show: true,
											position: 'top',
											formatter: function(axis){
												return setShowData(axis);
											}
										},
										color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
						                    offset: 0,
						                    color: '#c5e8f4' // 0% 处的颜色
						                }, {
						                    offset: 1,
						                    color: aloneColor // 100% 处的颜色
						                }], false)
									}
								},
							}]
						}
						break;
					case 'ybar':
						var option = {
							tooltip: {
								trigger: 'axis',
								axisPointer: {
									type: 'shadow'
								}
							},
							xAxis: {
								axisLine: {
									show: false
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash'
									}
								}
							},
							yAxis: {
								data: setjson(items.sort(function(a, b) {
								return a.value - b.value
							}),'name'),
								axisLabel: {
									rotate: Xrotate
								},
								axisLine: {
									show: false
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash'
									}
								}
							},
							grid: {
								left: '0',
								containLabel: true
							},
							series: [{
								type: 'bar',
								data: items.sort(function(a, b) {
								return a.value - b.value}),
								barCategoryGap: '40%',
								itemStyle: {
									normal: {
										label: {
											show: true,
											position: 'right',
							                textStyle: {
							                    color: aloneColor
							                },
											formatter: function(axis){
												return setShowData(axis);
											}
										},
										color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						                    offset: 0,
						                    color: 'lightBlue' // 0% 处的颜色
						                }, {
						                    offset: 1,
						                    color: aloneColor // 100% 处的颜色
						                }], false)
									}
								}
							}]
						}
						break;
					case 'pie':
						var option = {
							color: colors,
							tooltip: {
								show:true
							},
							grid: {
								left: '30%',
								right: '30%',
								top: '3%',
								containLabel: true
							},
							series: [{
								type: 'pie',
								radius: '50%',
								center: ['50%', '50%'],
								data: items,
								itemStyle: {
									normal: {
										label: {
											show: true,
											trigger: 'axis',
											formatter: function(axis){
												var v = axis.value;
												if(v>10000){
													v = (v / 10000).toFixed(0)+'万';
												}
												var d = axis.name+'\n'+v+'\n'+axis.data.percent;
												return d;
											}
										}
									}
								}
							}]
						}
						break;
					case 'zpie':
						var option = {
							color: colors,
							tooltip: {
								show:true
							},
							grid: {
								left: '30%',
								right: '30%',
								top: '3%',
								containLabel: false
							},
							series: [{
								type: 'pie',
								radius: ['25%', '50%'],
								center: ['50%', '50%'],
								data: items,
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)',

									},
									normal: {
										label: {
											show: true,
											trigger: 'axis',
											formatter: function(axis){
												var v = axis.value;
												if(v>10000){
													v = (v / 10000).toFixed(0)+'万';
												}
												var d = axis.name+'\n'+v+'\n'+axis.data.percent;
												return d;
											}
										}
									}
								}
							}]
						}
						break;
					case 'line':
						var option = {
							tooltip: {
								trigger: 'axis',
							},
							xAxis: {
								data: setjson(items, 'name'),
								axisLabel: {
									interval: 0,
									rotate: Xrotate
								},
								axisLine: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								}
							},
							yAxis: {
								axisLine: {
									show: false,
								},
								axisTick: {
									show: false
								},
								splitLine: {
									lineStyle: {
										type: 'dash',
									}
								}
							},
							grid: {
								containLabel: true
							},
							series: [{
								type: 'line',
								data: items,
								barCategoryGap: '50%',
								emphasis: {
									show: true,
								},
								itemStyle: {
									normal: {
										color: aloneColor,
										label: {
											show: true,
											position: 'top',
											formatter: function(axis){
												return setShowData(axis);
											}
										}
									}
								},
							}]
						}
						break;
          case 'linemor':
            var option = {
              tooltip: {
                trigger: 'axis',
              },
              dataZoom: [
                { //Y轴固定,让内容滚动
                  type: 'slider',
                  show: false,
                  xAxisIndex: [0],
                  start: 1,
                  zoomLock: false, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
                },
                {
                  type: 'inside',
                  xAxisIndex: [0],
                  start: 1,
                  zoomLock: false, //锁定区域禁止缩放
                },
              ],
              xAxis: {
                data: setjson(items, 'name'),
                axisLabel: {
                  interval: 0,
                  rotate: Xrotate
                },
                axisLine: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    type: 'dash',
                  }
                }
              },
              yAxis: {
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    type: 'dash',
                  }
                }
              },
              grid: {
                containLabel: true
              },
              series: [{
                type: 'line',
                data: items,
                barCategoryGap: '50%',
                emphasis: {
                  show: true,
                },
                itemStyle: {
                  normal: {
                    color: aloneColor,
                    label: {
                      show: true,
                      position: 'top',
                      formatter: function(axis){
                        return setShowData(axis);
                      }
                    }
                  }
                },
              }]
            }
            break;
					case 'map':
						var mapMax = 0;
						var mapMin = 0;
						mapMin = sortArr()[0].value;
						mapMax = sortArr(1)[0].value;
						var option = {
							tooltip: {
								formatter: "{b} : \n{c}"
							},
							visualMap: {
								min: mapMin,
								max: mapMax,
								left: 'left',
								top: 'bottom',
								text: ['最高', '最低'], // 文本，默认为数值文本
								calculable: true,
								orient: 'horizontal',
								inRange: {
									color: ['#e0ffff', aloneColor],
									symbolSize: [0, 50]
								}
							},
							toolbox: {
								show: false,
								orient: 'vertical',
								left: 'right',
								top: 'center',
								feature: {
									dataView: {
										readOnly: false
									},
									restore: {},
									saveAsImage: {}
								}
							},
							series: [{
								type: 'map',
								mapType: 'china',
								label: {
									normal: {
										show: false
									},
									emphasis: {
										textStyle: {
											color: '#fff'
										}
									}
								},
								itemStyle: {
									normal: {
										borderColor: '#fff',
										areaColor: '#fff',
									},
									emphasis: {
										areaColor: colors[1]
									}
								},
								animation: true,
								data: setArr()
							}]
						}
						break;
				}
				return option;

			},
			Vue.prototype.$chartHideLoading = function(id_, setlist) {
				var list = setlist;
				var id = id_
				for(var i in list) {
					var list_ = list[i].style_;
					for(var z in list_) {
						if(list_[z].id == id) {
							list_[z].hide = false;
							return
						}
					}
				}
			},
			Vue.prototype.$chartShowLoading = function(list) {
				for(var i in list) {
					var list_ = list[i].style_;
					for(var z in list_) {
						list_[z].hide = true;
					}
				}
			}
	}
}
