<template>
	<div class="pandect" v-loading='loading'>
		<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
			<el-form-item>
				<datePicker :models="time" v-on:timeChange='timeChange'></datePicker>
			</el-form-item>
			<el-form-item>
				<el-button type="success" icon="el-icon-search" @click="onSubmit">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-document" @click="downClick()">下载</el-button>
			</el-form-item>
		</el-form>
		<div id="jpgDom" style="overflow: hidden;">
			<div class="dataIntro">
				<p class="chartListTitle">数据概况</p>
				<el-row :gutter="12">
					<el-col :span="8">
						<el-card shadow="always">
							<p class="dataTxt">项目数量</p>
							<p class="dataNum">{{project_count}}</p>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="always">
							<p class="dataTxt">产品数量</p>
							<p class="dataNum">{{product_count}}</p>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="always">
							<p class="dataTxt">报名用户数量</p>
							<p class="dataNum">{{registration_users_count}}</p>
						</el-card>
					</el-col>
				</el-row>
			</div>
			<div v-for="item in project_dom_item" class="cl">
				<p class="chartListTitle">{{item.name}}</p>
				<div v-for="chart in item.style_" :style="{width:chart.width}" class="chartItem fl" v-loading="chart.hide">
					<p class="chartTitle" style="text-align: center;">{{chart.title}}</p>
					<div v-show="!(chart.notdata)" :id="chart.id" :style="{width:'100%',height:chart.height}/*no*/">
					</div>
          <div v-show="chart.notdata" class="noDataText" :style="{width:'100%',height:chart.height}/*no*/">
            暂无数据
          </div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import datePicker from "../public/datePicker"
	export default {
		name: "pandect",
		
		components: {
			datePicker
		},
		data() {
			return {
				loading:true,
				get_index:0,
				time: [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31'],
				formInline: {
					s_time: new Date().getFullYear() + '-01-01',
					e_time: new Date().getFullYear() + '-12-31'
				},
				project_count: 0, //项目数量
				product_count: 0, //产品数量
				registration_users_count: 0, //用户报名数
				select_data:[
					[
						{id:'project_count'},
						{id:'product_count'},
						{id:'registration_users_count'}
					],
					[	
						{
							id:"product_month_analysis",
							type:'bar',
							Xrotate:'40'
						},{
							id:"product_category_proportion",
							type:'pie',
							Xrotate:'0'
						},{
							id:"product_users_top",
							type:'ybar',
							Xrotate:'0'
						}
					],
					[
						{
							id:"users_gender",
							type:'pie',
							Xrotate:'0'
						},{
							id:"users_years",
							type:'pctbar',
							Xrotate:'0'
						},
						{
							id:"users_province",
							type:'map',
							Xrotate:'0'
						},{
							id:"users_province_top",
							type:'ybar',
							Xrotate:'0'
						}
					]
				],
				project_dom_item:[
				{
					name:"产品分析",
					style_:[
						{
							id:"product_month_analysis",
							width:'45%',
							height:'5rem',
							title:'产品月季度分布',
							hide:true,
              notdata:false
						},
						{
							id:"product_category_proportion",
							width:'45%',
							height:'5rem',
							title:'产品分类构成',
							hide:true,
              notdata:false
						},
						{
							id:"product_users_top",
							width:'90%',
							height:'7rem',
							title:'产品报名人数 TOP10',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"用户分析",
					style_:[
						{
							id:"users_gender",
							width:'45%',
							height:'5rem',
							title:'用户性别比例',
							hide:true,
              notdata:false
						},
						{
							id:"users_years",
							width:'45%',
							height:'5rem',
							title:'用户年龄分布',
							hide:true,
              notdata:false
						},
						{
							id:"users_province",
							width:'50%',
							height:'6rem',
							title:'用户地区分布',
							hide:true,
              notdata:false
						},
						{
							id:"users_province_top",
							width:'40%',
							height:'6rem',
							title:'用户地区分布 Top10',
							hide:true,
              notdata:false
						}
					]
				}]
			}
		},
		created: function() {
		},
		mounted() {
			/*
			 *type: bar柱状  ybar横向柱状  pctbar百分比横向柱状  pie饼状图  zpie环形图  map地图分布 line折线图
			 * */
			this.posts();
		},
		methods: {
			timeChange(value) {
				this.time = value;
			},
			downClick() {
				this.getPdf('统计表');
			},
			onSubmit() {
				if(this.time) {
					this.formInline.s_time = this.time[0];
					this.formInline.e_time = this.time[1];
				} else {
					this.formInline.s_time = new Date().getFullYear() + '-01-01';
					this.formInline.e_time = new Date().getFullYear() + '-12-31';
				}
				this.posts();
			},
			posts(){
				var get_index=0;
				this.loading=true;
        this.set_not_data(this.project_dom_item);
				this.set_loading_show(this.project_dom_item);
				this.getDate(this.select_data[0],0);
			},
			getDate(get_data,get_index) {
				var self = this;
				var select_arr=[];
				for(var index in get_data){
					select_arr.push(get_data[index].id);
				}
				self.formInline['select_arr']= select_arr;
				self.post('api/dataanalysis/dataScreening', self.formInline,
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							var select_ = self.select_data[get_index];
							if(get_index==0){
								self.project_count = data_.project_count;
								self.product_count = data_.product_count;
								self.registration_users_count = data_.registration_users_count;
								self.loading=false;
							}else{
								var echarts_list=[];
                var list = self.project_dom_item;
								for(var i in select_){
									var dom = document.getElementById(select_arr[i]);
									if(data_[select_arr[i]].length!=0){
									  if(data_[select_arr[i]].length==1&&data_[select_arr[i]][0].name==''){
                      self.set_notdata(select_[i].id,list);
                    }else{
                      var option_ = self.$setoption(data_[select_[i].id],select_[i]);
                      var chartObj = self.$echarts.init(dom, 'light');
                      chartObj.setOption(option_);
                      echarts_list.push(chartObj);
                    }
									}else{
                    self.set_notdata(select_[i].id,list);
									}
									self.set_loading_hide(select_[i].id,list);
								}
								window.addEventListener("resize", () => {
									for(var z = 0;z<echarts_list.length;z++){
										echarts_list[z].resize();
									}
								});
							}
							get_index++;
							if(get_index<self.select_data.length){
								self.getDate(self.select_data[get_index],get_index)
							}
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			set_loading_show(list){
				for(var i=0;i<list.length;i++){
					var list_ = list[i].style_;
					for(var z=0;z<list_.length;z++){
						list_[z].hide=true;
					}
				}
			},
			set_loading_hide(id,list){
				for(var i=0;i<list.length;i++){
					var list_ = list[i].style_;
					for(var z=0;z<list_.length;z++){
						if(list_[z].id == id){
							list_[z].hide=false;
							return
						}
					}
				}
			},
      set_not_data(list){
        for(var i=0;i<list.length;i++){
          var list_ = list[i].style_;
          for(var z=0;z<list_.length;z++){
            list_[z].notdata=false;
          }
        }
      },
      set_notdata(id,list){
        for(var i=0;i<list.length;i++){
          var list_ = list[i].style_;
          for(var z=0;z<list_.length;z++){
            if(list_[z].id == id){
              list_[z].notdata=true;
              return
            }
          }
        }
      }
		}
	}
</script>
<style scoped>
	.dataIntro {
		width: 50%;
		min-width: 1000px;
	}
	
	.dataTitle {
		font-size: 22px;
		padding: 20px 0;
		color: #666;
		font-weight: 600;
		clear: both;
	}
	
	.dataTxt {
		font-size: 24px;
		color: #1b96d5;
	}
	
	.dataNum {
		text-align: right;
		font-size: 35px;
		color: #777;
	}
</style>
