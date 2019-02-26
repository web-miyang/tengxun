<template>
	<div class="pandect" v-loading='loading'>
		<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
			<el-form-item>
				<datePicker :models="time" v-on:timeChange='timeChange'></datePicker>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="onSubmit" icon="el-icon-search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="downClick()" icon="el-icon-document">下载</el-button>
			</el-form-item>
		</el-form>
		<div id="jpgDom" v-for="chart in project_dom_item.style_" :style="{width:chart.width}" class="chartItem">
			<p class="chartTitle" style="text-align: center;">{{chart.title}}</p>
			<div v-show="!(notdata)" :id="chart.id" :style="{width:'100%',height:height}/*no*/">
			</div>
      <div v-show="notdata" class="noDataText" :style="{width:'100%'}/*no*/">
        暂无数据
      </div>
		</div>
	</div>
</template>
<script>
	import datePicker from "../public/datePicker"
	export default {
		name: "produc",
		components: {
			datePicker
		},
		data() {
			return {
				time: [new Date().getFullYear()+'-01-01',new Date().getFullYear()+'-12-31'],
				formInline: {
					s_time: new Date().getFullYear()+'-01-01',
					e_time: new Date().getFullYear()+'-12-31'
				},
				loading:true,
        notdata:false,
				height:'600px',
				select_data:{
					id:"product_users_top",
					type:'ybar'
				},
				project_dom_item:{
					name:"产品报名人数排名",
					style_:[
						{
							id:"product_users_top",
							width:'95%',
							title:'产品报名人数排名'
						}
					]
				}
			}
		},
		mounted() {
			this.getDate();
		},
		methods: {
			timeChange(value) {
				this.time = value;
			},
			downClick() {
				this.getPdf('产品报名分析');
			},
			onSubmit() {
				if(this.time){
					this.formInline.s_time=this.time[0];
					this.formInline.e_time=this.time[1];
				}else{this.formInline.s_time=new Date().getFullYear()+'-01-01';this.formInline.e_time=new Date().getFullYear()+'-12-31';}
        this.notdata=false;
				this.getDate();
			},
			getDate() {
				var self = this;
				self.loading = true;
				self.post('api/dataanalysis/productAnalysis', self.formInline,
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data.product_users_top;
							var dom = document.getElementById('product_users_top');
              //console.log(data_);
							if(data_.length!=0){
								var option_ = self.$setoption(data_,self.select_data);
								var chartObj = self.$echarts.init(dom, 'light');
								chartObj.setOption(option_);
								self.height = (150+data_.length*30)+'px';
                dom.style.height = (150+data_.length*30)+'px';
                chartObj.resize(dom);
								window.addEventListener("resize", () => {
									chartObj.resize();
								});
							}else{
							  console.log
								self.notdata=true;
							}
							self.loading=false;
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			}
		}
	}
</script>
<style scoped>
</style>
