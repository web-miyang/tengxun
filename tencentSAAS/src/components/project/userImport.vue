<template>
	<div id="userImport" class="userImport" v-loading="loading">
		<!--列表-->
		<el-table :data="tableData" border>
			<el-table-column prop="create_time" width="180" label="导入时间" align="center">
			</el-table-column>
			<el-table-column prop="admin_name" width="150" label="操作人" align="center">
			</el-table-column>
			<el-table-column prop="project_name" label="导入项目" align="center">
			</el-table-column>
			<el-table-column prop="product_name" label="导入产品" align="center">
			</el-table-column>
			<el-table-column prop="admin_name" width="150" label="导入进度" align="center">
				<template slot-scope="scope">
					<span>{{setData(scope.row)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="handle_number" width="200" label="已导入数量" align="center">
				<template slot-scope="scope">
					<span>{{getHandle(scope.row)}}</span>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<!--<div class="pageList">
			<el-pagination @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
			</el-pagination>
		</div>-->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading:true,
				time: '',
				/*formInline: {
					page:''
				},*/
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
				}
			}
		},
		created: function() {
			this.getList();
		},
		methods: {
			/*//分页
			handleCurrentChange(val) {
				this.page.index = val
				this.getList();
			},*/
			getHandle(row){
				if(row.total_number<row.handle_number){
					return row.total_number;
				}else{
					return row.handle_number
				}
			},
			setData(row){
				var per = Math.round(row.handle_number/row.total_number * 10000) / 100.00 + "%";
				return per;
			},
			//请求列表数据
			getList(){
				var self = this;
				self.loading=true;
				//self.formInline.page=this.page.index;
				self.post('api/Importexport/uploadMessage',{},
		  		function(data){
		  			if(data.data.code==200){
		  				self.tableData = data.data.data;
		  				self.loading=false;
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
	/deep/#userImport .el-table td, /deep/#userImport .el-table th{
		padding: 15px 0;
	}
	.pageList {
		text-align: center;
		padding-top: 20px;
	}
</style>