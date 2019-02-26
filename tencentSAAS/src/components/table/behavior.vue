<template>
	<div class="pandect" v-loading='loading'>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
				<el-button type="success" icon="el-icon-document" @click="downClick()">下载</el-button>
			</el-form-item>
		</el-form>
		<div v-for="item in project_dom_item" class="cl">
				<p class="chartListTitle">{{item.name}}</p>
				<div v-for="chart in item.style_" :style="{width:chart.width}" class="chartItem fl">
					<p class="chartTitle" style="text-align: center;">{{chart.title}}</p>
					<div :id="chart.id" :style="{width:'100%',height:chart.height}/*no*/">
					</div>
				</div>
			</div>
	</div>
</template>
<script>
	export default {
		name: "behavior",
		data() {
			return {
				loading:true,
				select_data:[{
					id:"user_participate_in_proportion",
					type:'zpie',
					Xrotate:'0'
				},{
					id:"user_participate_in_count",
					type:'line',
					Xrotate:'0'
				},{
					id:"more_user_participate_in_proportion",
					type:'zpie',
					Xrotate:'0'
				},{
					id:"more_user_more_participate_in_time_interval",
					type:'bar',
					Xrotate:'0'
				},{
          id:"user_province_order_average_price",
          type:'map',
          Xrotate:'0'
        },{
          id:"user_province_order_average_price_top",
          type:'ybar',
          Xrotate:'0'
        }
        ],
				project_dom_item:[{
					name:"用户参与情况分析",
					style_:[
						{
							id:"user_participate_in_proportion",
							width:'45%',
							height:'5rem',
							title:'活动参与类别'
						},
						{
							id:"user_participate_in_count",
							width:'45%',
							height:'5rem',
							title:'活动参与次数'
						}
					]
				},{
					name:"参与多次活动用户分析",
					style_:[
						{
							id:"more_user_participate_in_proportion",
							width:'45%',
							height:'5rem',
							title:'多次参与活动类型分布'
						},
						{
							id:"more_user_more_participate_in_time_interval",
							width:'45%',
							height:'5rem',
							title:'两次参与活动时间间隔'
						}
					]
				},{
          name:"各地区平均报名费金额",
          style_:[
            {
              id:"user_province_order_average_price",
              width:'50%',
              height:'6rem',
              title:'给地区平均报名费',
              hide:true,
              notdata:false
            },
            {
              id:"user_province_order_average_price_top",
              width:'40%',
              height:'6rem',
              title:'平均报名费 Top10 地区',
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
			this.getDate();
		},
		methods: {
			downClick() {
				this.getPdf('用户参与行为统计');
			},
			getDate() {
				var self = this;
				self.post('api/dataanalysis/userParticipateIn', {},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.loading = false;
							var chart_list = self.select_data;
							var echarts_list=[];
							for(var i in chart_list){
									var dom = document.getElementById(chart_list[i].id);
									if(data_[chart_list[i].id].length!=0){
										var option_ = self.$setoption(data_[chart_list[i].id],chart_list[i]);
										var chartObj = self.$echarts.init(dom, 'light');
										chartObj.setOption(option_);
										echarts_list.push(chartObj);
									}else{
										dom.innerHTML='<div class="noDataText">暂无数据</div>';
									}
								}
								window.addEventListener("resize", () => {
									for(var z = 0;z<echarts_list.length;z++){
										echarts_list[z].resize();
									}
								});
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
	.chartList {
		overflow: hidden;
	}
	
	.dataTitle {
		font-size: 18px;
		padding: 20px 0;
		color: #666;
		font-weight: 600;
		clear: both;
	}
</style>
