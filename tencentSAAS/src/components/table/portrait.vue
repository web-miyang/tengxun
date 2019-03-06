<template>
	<div class="pandect" v-loading='loading'>
		<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
			<el-form-item>
				<el-select v-model="formInline.gender" placeholder="性别" clearable>
					<el-option value='男'>男</el-option>
					<el-option value='女'>女</el-option>
				</el-select>
			</el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="formInline.s_time"
          type="month"
          placeholder="出生时间"
          :picker-options="sDateOpt"
          @change="stimeChange">
        </el-date-picker>
        <el-date-picker
          v-model="ee_time"
          type="month"
          placeholder="出生时间"
          :picker-options="eDateOpt"
          value-format="yyyy-MM"
          @change="etimeChange">
        </el-date-picker>
      </el-form-item>
			<el-form-item>
				<el-button type="success" @click="onSubmit" icon="el-icon-search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="downClick()" icon="el-icon-document">下载</el-button>
			</el-form-item>
		</el-form>
		<div id="jpgDom" style="overflow: hidden;">
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
        ee_time:null,
				formInline: {
          s_time: null,
          e_time: null,
					gender: ''
				},
        sDateOpt: {
          disabledDate(time) {
            return time.getTime() >  new Date()-8.64e7 || time.getTime() < new Date(new Date().getFullYear()-101,12);
          }
        },
        eDateOpt: {
          disabledDate(time) {
            return time.getTime() >  new Date()-8.64e7 || time.getTime() < new Date(new Date().getFullYear()-101,12);
          }
        },
				yearsOption: [
				{id: 1969,name: '70前'},
				{id: 1970,name: '70后'},
				{id: 1980,name: '80后'},
				{id: 1990,name: '90后'},
				{id: 2000,name: '00后'},
				{id: 2010,name: '10后'}
				],
				select_data:[
					[{
						id:"user_attr_gender",
						type:'zpie',
						Xrotate:'0'
					}],
					[{
						id:"user_attr_marriage_love",
						type:'pie',
						Xrotate:'0'
					},
						{
						id:"user_attr_offspring",
						type:'pie',
						Xrotate:'0'
						}
					],
					[
						{
							id:"user_attr_years",
							type:'pctbar',
							Xrotate:'0'
						},{
							id:"user_attr_identity",
							type:'bar',
							Xrotate:'55'
						},{
							id:"user_attr_education",
							type:'bar',
							Xrotate:'0'
						},{
							id:"user_attr_income",
							type:'bar',
							Xrotate:'40'
						}
					],
					[
						{
							id:"user_selection_sport_preference",
							type:'bar',
							Xrotate:'40'
						},{
							id:"user_selection_hobby",
							type:'bar',
							Xrotate:'0'
						}
					],
					[
						{
							id:"user_selection_video_pay",
							type:'bar',
							Xrotate:'0'
						},
						{
							id:"user_selection_information",
							type:'bar',
							Xrotate:'0'
						}
					]
				],
				project_dom_item:[
				{
					name:"用户属性",
					style_:[
						{
							id:"user_attr_gender",
							width:'30%',
							height:'5rem',
							title:'用户性别比例',
							hide:true,
              notdata:false
						},
						{
							id:"user_attr_marriage_love",
							width:'30%',
							height:'5rem',
							title:'婚恋状况',
							hide:true,
              notdata:false
						},
						{
							id:"user_attr_offspring",
							width:'30%',
							height:'5rem',
							title:'子嗣状况',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"社会身份信息",
					style_:[
						{
							id:"user_attr_years",
							width:'45%',
							height:'5rem',
							title:'用户年龄分布',
							hide:true,
              notdata:false
						},
						{
							id:"user_attr_identity",
							width:'45%',
							height:'5rem',
							title:'社会身份',
							hide:true,
              notdata:false
						},
						{
							id:"user_attr_education",
							width:'45%',
							height:'5rem',
							title:'学历状况',
							hide:true,
              notdata:false
						},
						{
							id:"user_attr_income",
							width:'45%',
							height:'5rem',
							title:'年收入',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"兴趣偏好",
					style_:[
						{
							id:"user_selection_sport_preference",
							width:'45%',
							height:'5rem',
							title:'运动偏好',
							hide:true,
              notdata:false
						},
						{
							id:"user_selection_hobby",
							width:'45%',
							height:'5rem',
							title:'兴趣爱好',
							hide:true,
              notdata:false
						}
					]
				},{
					name:"视频娱乐及资讯获取",
					style_:[
						{
							id:"user_selection_video_pay",
							width:'45%',
							height:'5rem',
							title:'视频付费会员',
							hide:true,
              notdata:false
						},
						{
							id:"user_selection_information",
							width:'45%',
							height:'5rem',
							title:'资讯获取途径',
							hide:true,
              notdata:false
						}
					]
				}]
			}
		},
		mounted() {
			/*
			 *type: bar柱状  ybar横向柱状  pctbar百分比横向柱状  pie饼状图  zpie环形图  map地图分布 line折线图
			 * */
			this.posts();
		},
		methods: {
      stimeChange(value){
        var self = this;
        this.eDateOpt.disabledDate = function(time) {
          if(self.e_time!=null){
            return time.getTime() >  new Date()-8.64e7 || time.getTime() < new Date(self.e_time);
          }else{
            return time.getTime() >  new Date()-8.64e7 || time.getTime() < new Date(value);
          }
        }
      },
      etimeChange(value){
        this.sDateOpt.disabledDate = function(time) {
          if(self.s_time!=null){
            return time.getTime() >  new Date(self.s_time) || time.getTime() < new Date(new Date().getFullYear()-101,12);
          }else{
            return time.getTime() >  new Date(value) || time.getTime() < new Date(new Date().getFullYear()-101,12);
          }
        }
      },
			downClick() {
				this.getPdf('用户画像');
			},
			onSubmit() {
				this.posts();
			},
			posts(){
        var s = this.formInline.s_time;
        var e = this.ee_time;
        if(s!=null && e!=null){
          var arreTime = e.split('-');
          this.formInline.e_time = new Date(new Date(arreTime[0],arreTime[1],1));
        }else{
          this.formInline.s_time = null;
          this.formInline.e_time = null;
          this.ee_time = null;
        }
				this.loading=true;
				this.set_loading_show(this.project_dom_item);
        this.set_not_data(this.project_dom_item);
				this.getDate(this.select_data[0],0);
			},
			getDate(get_data,get_index){
				var self = this;
				var select_arr=[];
				for(var index in get_data){
					select_arr.push(get_data[index].id);
				}
				self.formInline['select_arr']= select_arr;
				self.post('api/dataanalysis/userPortrait', self.formInline,
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							var select_ = self.select_data[get_index];
							var echarts_list=[];
              var list = self.project_dom_item;
							for(var i in select_){
								var dom = document.getElementById(select_arr[i]);
								if(data_[select_arr[i]].length!=0){
									var option_ = self.$setoption(data_[select_[i].id],select_[i]);
									var chartObj = self.$echarts.init(dom, 'light');
									chartObj.setOption(option_);
									echarts_list.push(chartObj);
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
							get_index++;
							if(get_index>0){
								self.loading=false;
							}
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
        for(var i=0;i<this.project_dom_item.length;i++){
          var list_ = this.project_dom_item[i].style_;
          for(var z=0;z<list_.length;z++){
            if(list_[z].id == id){
              console.log(list_[z].notdata);
              list_[z].notdata=true;
              console.log(list_[z].notdata);
              return
            }
          }
        }
      }
		}
	}
</script>
<style scoped>
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
