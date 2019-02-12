<template>
	<div class="projectList" v-loading='loading'>
		<div class="list" v-if="!createDate.type">
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-select v-model="formInline.status" style="width:100px;" :value="formInline.status" clearable placeholder="角色状态">
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.id" style="width:140px;" placeholder="角色编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="setClick()">新建角色</el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column prop="id" width="150" label="角色编号" align="center">
				</el-table-column>
				<el-table-column prop="name" width="150" label="角色名称" align="center">
				</el-table-column>
				<el-table-column prop="remarks" label="角色备注" align="center">
				</el-table-column>
				<el-table-column label="状态" width="80" align="center">
					<template slot-scope="scope">
						<switchEl :scope="scope" :postUrl='switchPostUrl'></switchEl>
				    </template>
				</el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template slot-scope="scope">
				        <el-button @click="setClick(scope.row)" type="text">修改</el-button>
				    </template>
				</el-table-column>
			</el-table>
		</div>
		<create v-if="createDate.type" v-on:back="back" :createDate="createDate"></create>
	</div>
</template>

<script>
	import create from "./createRole";
	import switchEl from "../public/dialog";
	export default {
		components: {
			create,
			switchEl
		},
		data() {
			return {
				loading:true,
				formInline: {
					status: '',
					id: '',
					name: ''
				},
				tableData: [/*{id:1,name:"超级管理员",desc: '角色备注',status: 1}*/],
		        createDate:{
		           type:false,
		           data:'',
		           name:'',
		           state:''
		        },
		        switchPostUrl:'api/Role/changeRoleStatus'
			}
		},
		created: function() {
			this.onSubmit();
		},
		methods: {
			onSubmit() {
				/*搜索*/
				var self = this;
				self.loading=true;
				self.post('api/Role/roleManagement',self.formInline,
		  		function(data){
		  			if(data.data.code==200){
		  				self.tableData = data.data.data;
		  				self.loading=false;
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			//创建、修改角色
			setClick(row){
				this.createDate.type=true;
				if(!row){
					this.createDate.name='创建角色';
					this.createDate.data='';
				}else{
					this.createDate.name='修改角色';
					this.createDate.data=row;
				}
			},
		    back(){
		    	this.onSubmit();
		    	this.createDate.type = !this.createDate.type;
		    }
		}
	}
</script>

<style>
</style>