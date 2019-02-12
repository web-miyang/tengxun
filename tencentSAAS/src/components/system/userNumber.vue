<template>
	<div class="projectList" v-loading='loading'>
		<div class="list" v-if="!createDate.type">
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-select v-model="formInline.role_id" placeholder="所属权限" style="width:140px;" clearable>
						<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="formInline.status" style="width:100px;" :value="formInline.status" clearable placeholder="状态">
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.id" style="width:140px;" placeholder="编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.account" style="width:140px;" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.name" style="width:130px;" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.phone" style="width:140px;" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="setClick()">新建账号</el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column prop="id" label="编号" align="center">
				</el-table-column>
				<el-table-column prop="account" label="账号" align="center">
				</el-table-column>
				<el-table-column prop="name" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="手机号码" align="center">
				</el-table-column>
				<el-table-column prop="rname" label="权限" align="center">
				</el-table-column>
				<el-table-column label="绑定微信" align="center">
					<template slot-scope="scope">
						<el-button v-if="!get_wx(scope.row.wx_openid)" @click="wechatClick(scope.row)" type="text">去绑定</el-button>
						<span v-if="get_wx(scope.row.wx_openid)">已绑定</span>
					</template>
				</el-table-column>
				<el-table-column label="账号状态" align="center">
					<template slot-scope="scope_">
						<switchEl :scope="scope_" :postUrl='switchPostUrl'></switchEl>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button @click="setClick(scope.row)" type="text">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<addUser v-if="createDate.type" v-on:back="back" :createDate="createDate"></addUser>
	</div>
</template>

<script>
	import addUser from "./addUser";
	import switchEl from "../public/dialog";
	export default {
		components: {
			addUser,
			switchEl
		},
		data() {
			return {
				loading:true,
				formInline: {
					role_id: '',
					status: '',
					id: '',
					account: '',
					name: '',
					phone: ''
				},
				tableData: [/*{id: 1,name: '张三',account:'123@qq.com',rname: "超级管理员",
				//gender: '男',
				phone: '18812110230',wechat: 'ha',status: '1'}*/],
				role: [],
				createDate: {
					type: false,
					data: '',
					name: '',
					state: '',
					role: []
				},
				switchPostUrl:'api/Role/changeAdminStatus'
			}
		},
		created: function() {
			/*获取用户列表*/
			var self = this;
			self.loading=true;
			self.getPresonList({});
			/*获取角色列表*/
			self.post('api/Role/roleManagement',{},
	  		function(data){
	  			if(data.data.code==200){
	  				self.role = data.data.data;
	  				self.createDate.role=data.data.data;
	  				self.loading=false;
	  			}else{
	  				self.$message.error(data.data.msg);
	  			}
	  		},function(error){
	  		});
		},
		methods: {
			onSubmit() {
				/*搜索*/
				this.getPresonList(this.formInline);
			},
			back() {
				this.getPresonList({});
				this.createDate.type = !this.createDate.type;
			},
			wechatClick(row) {
				//微信绑定
				this.$alert("<img src='../../../static/img/u34.png'/>", '绑定微信', {
					confirmButtonText: '关闭',
					center: true,
					dangerouslyUseHTMLString: true,
					callback: action => {
						//发送请求查看 账号是否绑定微信
						row.wechat = !row.wechat;
					}
				});
			},
			//创建、修改账号
			setClick(row) {
				this.createDate.type = true;
				if(!row) {
					this.createDate.name = '创建账号';
					this.createDate.data = '';
					this.createDate.state = true;
				} else {
					this.createDate.name = '修改账号';
					this.createDate.data = row;
					this.createDate.state = false;
				}
			},
			/*请求接口 方法*/
			getPresonList(data){
				var self = this;
				self.post('api/Role/presonList', data,
				function(data) {
					if(data.data.code == 200) {
						self.tableData = data.data.data;
					} else {
						self.$message.error(data.data.msg);
					}
				},
				function(error) {
				});
			},
			get_wx(wx){
				if(wx==''||wx==null){
					return false;
				}else{
					return true;
				}
			}
		}
	}
</script>

<style>

</style>