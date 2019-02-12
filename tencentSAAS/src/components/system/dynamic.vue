<template>
	<div class="dynamic" v-loading='loading'>
		<el-table :data="tableData" style="width: 100%;">
			<el-table-column prop="account" width="190" label="操作账号" align="center">
			</el-table-column>
			<el-table-column prop="name" width="130" label="操作人姓名" align="center">
			</el-table-column>
			<el-table-column prop="create_time" width="190" label="操作时间" align="center">
			</el-table-column>
			<el-table-column prop="type" width="190" label="操作类型" align="center">
			</el-table-column>
			<el-table-column prop="content" label="操作内容" align="center">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				loading:true,
				tableData:[
					/*{account:'hehehe@tengxun.com',
					name:'李靖',
					create_time:'2018-12-13 21:49',
					type:'新建项目',
					content:'新建项目：2018腾讯超级企鹅跑新建项目：2018腾讯超级企鹅跑新建项目：2018腾讯超级企鹅跑新建项目：2018腾讯超级企鹅跑新建项目：2018腾讯超级企鹅跑新建项目：2018腾讯超级企鹅跑'
				}*/]
			}
		},
		created:function(){
			var self = this;
			self.loading=true;
			self.post('api/Operationlog/index',{},
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
</script>

<style>

</style>