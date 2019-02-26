<template>
	<div class="pandect" v-loading='loading'>
		<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
			<el-form-item>
				<datePicker :models="time" v-on:timeChange='timeChange'></datePicker>
			</el-form-item>
			<el-form-item>
				<el-select @change="projectChange" v-model="formInline.project_id" placeholder="选择项目" clearable>
					<el-option v-for="item in project_item" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select @change="productChange"  v-model="formInline.product_id" placeholder="选择产品" clearable>
					<el-option v-for="item in product_item" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="onSubmit" icon="el-icon-search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="downClick()" icon="el-icon-document">下载</el-button>
			</el-form-item>
		</el-form>
		<div id="jpgDom" style="overflow: hidden;">
			<div class="dataIntro">
				<el-row :gutter="12">
					<el-col :span="8">
						<el-card shadow="always">
							<p class="dataTxt">报名用户数量</p>
							<p class="dataNum">{{project_registration_users_count}}</p>
						</el-card>
					</el-col>
          <el-col :span="8">
            <el-card shadow="always">
              <p class="dataTxt">报名费合计金额</p>
              <p class="dataNum">{{project_registration_users_order_total_amount}}</p>
            </el-card>
          </el-col>
				</el-row>
			</div>
			<div v-for="item in project_dom_item" class="cl">
				<p class="chartListTitle">{{item.name}}</p>
				<div v-for="chart in item.style_" :style="{width:chart.width}" class="chartItem fl" v-loading="chart.hide">
					<p class="chartTitle" style="text-align: center;">{{chart.title}}</p>
					<div v-show="!(chart.notdata)"  :id="chart.id" :style="{width:'100%',height:chart.height}/*no*/">
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
		name: "analysis",
		components: {
			datePicker
		},
		data() {
			return {
				loading:true,
				time: [new Date().getFullYear()+'-01-01',new Date().getFullYear()+'-12-31'],
				project_item:[],
				product_item:[],
				formInline: {
					s_time: new Date().getFullYear()+'-01-01',
					e_time: new Date().getFullYear()+'-12-31',
					project_id:'',
					product_id:''
				},
				project_registration_users_count: 0, //用户报名数
        project_registration_users_order_total_amount:0,//报名费合计金额
				select_data:[
					[{id:'project_registration_users_count'},
            {id:'project_registration_users_order_total_amount'}],
					[{
						id:"project_user_attr_gender",
						type:'pie',
						Xrotate:'0'
					},{
						id:"project_user_attr_marriage_love",
						type:'pie',
						Xrotate:'0'
					},
						{
						id:"project_user_attr_offspring",
						type:'pie',
						Xrotate:'0'
						}
					],
					[
						{
							id:"project_user_province",
							type:'map',
							Xrotate:'0'
						},{
							id:"project_user_province_top",
							type:'ybar',
							Xrotate:'0'
						}
					],
					[
						{
							id:"project_user_attr_years",
							type:'bar',
							Xrotate:'0'
						},{
							id:"project_user_attr_identity",
							type:'bar',
							Xrotate:'40'
						},{
							id:"project_user_attr_education",
							type:'bar',
							Xrotate:'0'
						},{
							id:"project_user_attr_income",
							type:'bar',
							Xrotate:'40'
						}
					],
					[
						{
							id:"project_user_selection_sport_preference",
							type:'bar',
							Xrotate:'30'
						}
					],
					[{
							id:"project_user_selection_hobby",
							type:'bar',
							Xrotate:'40'
						}],
					[
						{
							id:"project_user_selection_video_pay",
							type:'bar',
							Xrotate:'0'
						}
          ],
					[{
							id:"project_user_selection_information",
							type:'bar',
							Xrotate:'0'
						},{
            id:"project_registration_users_order_amount_distribution",
            type:'line',
            Xrotate:'0'
          }]
				],
				project_dom_item:[
				{
					name:"用户分析",
					style_:[
						{
							id:"project_user_attr_gender",
							width:'30%',
							height:'5rem',
							title:'用户性别比例',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_attr_marriage_love",
							width:'30%',
							height:'5rem',
							title:'婚恋状况',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_attr_offspring",
							width:'30%',
							height:'5rem',
							title:'子嗣状况',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"地域分析",
					style_:[
						{
							id:"project_user_province",
							width:'50%',
							height:'6rem',
							title:'用户所在地区分布',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_province_top",
							width:'40%',
							height:'6rem',
							title:'用户量TOP10省份',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"社会身份信息",
					style_:[
						{
							id:"project_user_attr_years",
							width:'45%',
							height:'6rem',
							title:'用户年龄分布',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_attr_identity",
							width:'45%',
							height:'6rem',
							title:'社会身份',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_attr_education",
							width:'45%',
							height:'6rem',
							title:'学历状况',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_attr_income",
							width:'45%',
							height:'6rem',
							title:'年收入',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"兴趣偏好",
					style_:[
						{
							id:"project_user_selection_sport_preference",
							width:'45%',
							height:'6rem',
							title:'运动偏好',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_selection_hobby",
							width:'45%',
							height:'6rem',
							title:'兴趣爱好',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"视频娱乐及资讯获取",
					style_:[
						{
							id:"project_user_selection_video_pay",
							width:'45%',
							height:'6rem',
							title:'视频付费会员',
							hide:true,
              notdata:false
						},
						{
							id:"project_user_selection_information",
							width:'45%',
							height:'6rem',
							title:'资讯获取途径',
							hide:true,
              notdata:false
						}
					]
				},{
            name:"报名费分布情况",
            style_:[
              {
                id:"project_registration_users_order_amount_distribution",
                width:'45%',
                height:'6rem',
                title:'报名费分布情况',
                hide:true,
                notdata:false
              }
            ]
          }]
			}
		},
		created: function() {
			this.getproject();
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
				if(this.time){
					this.formInline.s_time=this.time[0];
					this.formInline.e_time=this.time[1];
				}else{
					this.formInline.s_time=new Date().getFullYear()+'-01-01';this.formInline.e_time=new Date().getFullYear()+'-12-31';
				}
			},
			downClick() {
				this.getPdf('项目分析统计表');
			},
			onSubmit() {
				this.posts();
			},
			posts(){
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
				self.post('api/dataanalysis/projectAnalysis', self.formInline,
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							var select_ = self.select_data[get_index];
							if(get_index==0){
								self.project_registration_users_count = data_.project_registration_users_count;
								self.loading=false;
							}else{
                var list = self.project_dom_item;
								var echarts_list=[];
								for(var i in select_){
									var dom = document.getElementById(select_arr[i]);
									if(data_[select_arr[i]].length!=0){
									  if(data_[select_arr[i]].length==1&&data_[select_arr[i]][0].name==''){
                      self.set_notdata(select_[i].id,list);
                    }else{
                      var option_ = self.$setoption(data_[select_[i].id],select_[i]);
                      var chartObj = self.$echarts.init(dom, 'light');
                      chartObj.setOption(option_);
                      echarts_list.push(chartObj)
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
							get_index++
							if(get_index<self.select_data.length){
								self.getDate(self.select_data[get_index],get_index)
							}
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {
						self.$message.error("请求超时");
					});
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
			getproject(){
				var self = this;
				self.post('api/Project/getAllProject', {},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.project_item = data_
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			projectChange(value){
				var self = this;
				self.post('api/product/getAllProductByProjectId', {project_id:value},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.product_item = data_
							self.formInline.product_id='';
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			productChange(value){
				this.formInline.product_id=value;
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
		font-size: 18px;
		padding: 20px 0;
		color: #666;
		font-weight: 600;
		clear: both;
	}
	
	.dataTxt {
		font-size: 24px;
		color: #409EFF;
	}
	
	.dataNum {
		text-align: right;
		font-size: 35px;
		color: #777;
	}
</style>
