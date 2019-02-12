<template>
	<div class="projectList" v-loading='loading'>
		<div class="list" v-if="!createDate.type">
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-input v-model="formInline.name" style="width:140px;" placeholder="用户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.phone" style="width:140px;" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" icon="el-icon-search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" style="max-width: 1000px;">
				<el-table-column prop="id" label="用户编号" align="center">
				</el-table-column>
				<el-table-column prop="name" label="用户姓名" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="用户手机号" align="center">
				</el-table-column>
				<el-table-column label="重复内容管理" width="150" align="center">
					<template slot-scope="scope">
						<el-button @click="repeatClick(scope.row)" type="text">管理</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pageList" style="max-width: 1000px;">
				<el-pagination @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
				</el-pagination>
			</div>
		</div>
		<setRepeat v-if="createDate.type" v-on:back="back" :createDate="createDate"></setRepeat>
	</div>
</template>

<script>
	import setRepeat from "./setRepeat"
	export default {
		components: {
			setRepeat
		},
		data() {
			return {
				loading:true,
				formInline: {
					name: '', //用户姓名
					phone: '', //手机号
					page: 1
				},
				tableData: [],
				//分页变量
				page: {
					index: 1,
					size: 10,
					count: 0
				},
				createDate: {
					type: false,
					userData: '',
					repeatData: '',
					repeatTitle: '',
					postData:{}
				}
			}
		},
		created: function() {
			this.getList();
		},
		methods: {
			onSubmit() {
				/*搜索*/
				this.page.index = 1;
				this.getList();
			},
			//重复信息管理
			repeatClick(row) {
				var self = this;
				self.createDate.userData = row;
				self.post('api/User/getUserRepeatByUserId', {
						user_id: row.id
					},
					function(data) {
						if(data.data.code == 200) {
							self.createDate.repeatData = data.data.data.data;
							self.createDate.repeatTitle = data.data.data.title;
							self.createDate.type = true;
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {
					});

			},
			back() {
				this.createDate.type = !this.createDate.type;
				this.getList();
			},
			//分页
			handleCurrentChange(val) {
				this.page.index = val
				this.getList();
			},
			getList() {
				var self = this;
				self.loading=true;
				self.formInline.page = self.page.index;
				self.post('api/User/getUserRepeat', self.formInline,
					function(data) {
						if(data.data.code == 200) {
							self.tableData = data.data.data.data;
							self.page.count = data.data.data.count;
							self.loading=false;
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {
					});
			}
		}
	}
</script>

<style scoped>
	/*.el-table {
		width: 601px;
	}*/
	
	.pageList {
		width: 100%;
		text-align: center;
		padding-top: 20px;
	}
</style>