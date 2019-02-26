<template>
	<div class="projectList" v-loading="loading">
		<div class="list" v-if="!createDate.type">
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-select v-model="formInline.status" style="width:100px;" placeholder="项目状态" clearable>
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.project_num" style="width:140px;" placeholder="项目编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.name" placeholder="项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.admin_name" style="width:100px;" placeholder="项目创建人"></el-input>
				</el-form-item>
				<el-form-item>
					<datePicker :models="time" v-on:timeChange='timeChange'></datePicker>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="onSubmit" >查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="setClick('')" >创建项目</el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" style="max-width:1300px">
				<el-table-column prop="project_num" label="项目编号" width="200" align="center">
				</el-table-column>
				<el-table-column prop="name" label="项目名称" align="center">
				</el-table-column>
				<el-table-column label="项目起止时间" align="center" width="200">
					<template slot-scope="scope">
						<span>{{scope.row.s_time}} 至  {{scope.row.e_time}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="admin_name" label="项目创建人" width="150" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="250">
					<template slot-scope="scope">
						<el-button @click="productClick(scope.row)" type="primary" plain size="mini">管理</el-button>
						<el-button @click="look(scope.row)" type="primary" plain size="mini">备注</el-button>
						<el-button @click="setClick(scope.row)" type="primary" plain size="mini">修改</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" width="100" >
					<template slot-scope='scope'>
						<switchEl :scope="scope" :postUrl='switchPostUrl'></switchEl>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pageList">
				<el-pagination @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
				</el-pagination>
			</div>
		</div>
		<el-dialog
		  :title="tipName+'备注'"
		  :visible.sync="tip"
		  width="30%">
		  <div style="word-break:break-all;">{{tipText}}</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="tip = false">关闭</el-button>
		  </span>
		</el-dialog>
		<create v-if="createDate.type" v-on:back="back" :createDate="createDate"></create>
	</div>
</template>

<script>
	import create from "./create";
	import datePicker from "../public/datePicker";
	import switchEl from "../public/dialog"
	export default {
		components: {
			create,
			datePicker,
			switchEl
		},
		data() {
			return {
				loading:true,
				tip:false,
				tipText:'',
				tipName:'',
				time: '',
				formInline: {
					status: '',
					project_num: '',
					name: '',
					s_time:'',
					e_time:'',
					admin_name: '',
					page:''
				},
				tableData: [/*{
						id: 1,
						Project_num: "123",
						name: "名称1",
						s_time: '2016-05-02',
						e_time:'2016-05-02',
						admin_name: '王小虎1',
						remarks: '备注上海市普陀区金沙江路 1518 弄',
						status: 1
					}*/],
				page: {
					index: 1,
					size: 10,
					count: 0
				},
				switchPostUrl:'api/Project/changeProjectStatus',
				createDate: {
					type: false,
					data: '',
					name: ''
				}
			}
		},
		created: function() {
			this.getList();
		},
		methods: {
			timeChange(value){
				this.time = value;
			},
			onSubmit() {
				/*搜索*/
				this.page.index=1;
				this.getList();
			},
			productClick(row) {
				/*管理项目*/
				this.$datacenter.setData("product", row);//保存当前项目信息
				this.$router.push({name: '/project/product'});
			},
			//创建、修改项目
			setClick(row) {
				this.createDate.type = true;
				this.createDate.data = row;
				if(row=='') {
					this.createDate.name = '创建项目';
				} else {
					this.createDate.name = '修改项目';
				}
			},
			//弹窗
			look(row) {
				this.tipText = row.remarks;
				this.tipName = row.name;
				this.tip=true;
			},
			//分页
			handleCurrentChange(val) {
				this.page.index = val
				this.getList();
			},
			back() {
				this.createDate.type = false;
				this.getList();
			},
			//请求列表数据
			getList(){
				var self = this;
				self.loading=true;
				self.formInline.page=this.page.index;
				//console.log(self.time);
				self.formInline.s_time = self.time[0];
				self.formInline.e_time = self.time[1];
				self.post('api/Project/index',self.formInline,
		  		function(data){
		  			if(data.data.code==200){
		  				self.tableData = data.data.data.data;
		  				self.page.count = data.data.data.count;
		  				self.loading = false;
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			}
		}
	}
</script>

<style scoped>
	
</style>
