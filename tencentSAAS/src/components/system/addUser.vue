<template>
	<div class="create">
		<div class="templateTitle">
			{{createDate.name}}
		</div>
		<el-form label-width="100px" class="demo-ruleForm w500">
			<el-form-item label="账号" required>
				<el-input :disabled='white' v-model="fromMode.account" placeholder="请输入账号，不得输入汉字" clearable></el-input>
			</el-form-item>
			<el-form-item label="员工姓名" required>
				<el-input v-model="fromMode.name" placeholder="请输入员工姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号码" required>
				<el-input  v-model="fromMode.phone" maxlength='11' placeholder="请输入手机号码" clearable></el-input>
			</el-form-item>
			<el-form-item v-if="showPass" label="登录密码" required>
				<el-input v-model="passWord" type="password" placeholder="请输入登录密码" clearable></el-input>
			</el-form-item>
			<el-form-item v-if="showPass" label="确认密码" required>
				<el-input v-model="passNum" 
					type="password" 
					placeholder="请输入确认密码" 
					clearable></el-input>
			</el-form-item>
			<el-form-item label="所属权限" required>
				<el-select v-model="fromMode.role_id" placeholder="请选择" clearable>
					<el-option v-for="item in role"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="createClick()">{{createDate.name}}</el-button>
				<el-button v-on:click="back">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fromMode: {
					account: '',
					name: '',
					phone: '',
					role_id: '',
				},
				id: '',
				passWord:'',
				passNum:'',
				role: [],
				rule:false,
				showPass: true,
				white:false
			}
		},
		props: ['createDate'],
		created: function() {
			var self = this;
			self.showPass = self.createDate.state;
			self.role = self.createDate.role;
			if(self.createDate.data != ""){
				self.white = true;
				self.fromMode.id = self.createDate.data.id;
				self.fromMode.account = self.createDate.data.account;
				self.fromMode.name = self.createDate.data.name;
				self.fromMode.phone = self.createDate.data.phone;
				self.fromMode.role_id = self.createDate.data.role_id;
			}
		},
		methods: {
			back() {
				this.$emit("back");
			},
			createClick() {
				var self = this;
				switch(''){
		  			case self.fromMode.account:
			  			self.$message.error('账号不能为空');
			  			return
		  			case self.fromMode.name:
			  			self.$message.error('姓名不能为空');
			  			return
			  		case self.fromMode.phone:
			  			self.$message.error('手机号码不能为空');
			  			return
			  		case self.fromMode.role_id:
			  			self.$message.error('请选择权限');
			  			return
		  		}
				if(self.fromMode.role_id==null){
					self.$message.error('请选择权限');
			  			return
				}
				var reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
				var des = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
				if(des.test(self.fromMode.account)){
					self.$message.error('账号格式错误！');
					return;
				}
				if(!reg.test(self.fromMode.phone)){
					self.$message.error('请输入正确手机号码');
					return;
				}
				//接口
				if(self.showPass) {
					//新建账号
					if(self.passWord==''){self.$message.error('密码不能为空');return}
					else if(self.passWord!=self.passNum){self.$message.error('密码确认密码不同');return}
					self.fromMode['password'] = self.passWord;
					self.post('api/Role/addAdmin', self.fromMode,
						function(data) {
							if(data.data.code == 200) {
								self.$message.success(data.data.msg);
								self.back();
							} else {
								self.$message.error(data.data.msg);
							}
						},
						function(error) {});
				} else {
					//修改账号
					self.post('api/Role/editAdmin', self.fromMode,
						function(data) {
							if(data.data.code == 200) {
								self.$message.success(data.data.msg);
								self.back();
							} else {
								self.$message.error(data.data.msg);
							}
						},
						function(error) {});
				}
			}
		}
	}
</script>

<style>
	
</style>