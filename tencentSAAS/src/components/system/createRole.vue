<template>
	<div class="create">
		<div class="templateTitle">
			{{createDate.name}}
		</div>
		<el-form label-width="100px" class="demo-ruleForm" style="width: 650px;">
			<el-form-item label="项目名称" required>
			    <el-input v-model="formInfo.name" maxlength='20' placeholder="请输入角色名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注">
		    	<el-input type="textarea" v-model="formInfo.remarks" maxlength='200' rows='8' clearable placeholder="请输入角色备注，200字以内"></el-input>
			</el-form-item>
			<el-form-item label="权限" required>
				<template v-for="(item,index) in roles">
					<el-checkbox v-model="formInfo.role" @change="headCheckAll(item.info,$event)" :label="item.id" :key="item.id">{{item.title}}</el-checkbox>
					<div style="margin: 10px 30px 30px;">
						<el-checkbox v-for="child in item.info" v-model="formInfo.role" :label="child.id" :key="child.id" @change="checkedChange(child.pid,$event)">{{child.title}}</el-checkbox>
					</div>
				</template>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="createClick">{{createDate.name}}</el-button>
				<el-button v-on:click="back">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				checkAll: false,
				roles: [],
				formInfo:{
					name:'',
					remarks:'',
					role: [], //模拟初始值
				}
			}
		},
		props: ['createDate'],
		created: function() {
			/*获取角色权限*/
			var self = this;
			if(self.createDate.data != '') {
				self.formInfo.name = self.createDate.data.name;
				self.formInfo.remarks = self.createDate.data.remarks;
				self.getRoles(self.createDate.data.id);
			}else{
				self.getAllRoles();
			}
		},
		methods: {
			back() {
				this.$emit("back");
			},
			headCheckAll(item, type) {
				if(type) {
					for(var i = 0; i < item.length; i++) {
						if(this.formInfo.role.indexOf(item[i].id) < 0) {
							this.formInfo.role.push(item[i].id)
						}
					}
				} else {
					for(var i = 0; i < item.length; i++) {
						if(this.formInfo.role.indexOf(item[i].id) >= 0) {
							var index = this.formInfo.role.indexOf(item[i].id);
							this.formInfo.role.splice(index, 1);
						}
					}
				}
				
			},
			checkedChange(id, type) {
				if(type) {
					this.formInfo.role.push(id);
					this.formInfo.role = Array.from(new Set(this.formInfo.role));
				}
			},
			getAllRoles(){
				var self = this;
				//修改角色
				self.post('api/Role/getAllRole', {},
					function(data) {
						if(data.data.code == 200) {
							var roleData = data.data.data;
							self.roles = roleData;
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			getRoles(id){
				var self = this;
				//修改角色
				self.post('api/Role/getRoleById', {id: id},
					function(data) {
						if(data.data.code == 200) {
							var roleData = data.data.data.role
							self.roles = roleData;
							for(var i = 0; i < roleData.length; i++) {
								if(roleData[i].ischecked == 1) {
									self.formInfo.role.push(roleData[i].id)
								};
								for(var z = 0; z < roleData[i].info.length; z++) {
									if(roleData[i].info[z].ischecked == 1) {
										self.formInfo.role.push(roleData[i].info[z].id)
									};
								}
							}
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			createClick() {
				var self = this;
				switch(''||undefined){
		  			case self.formInfo.name:
			  			self.$message.error('角色名称不能为空');
			  			return
		  			case self.formInfo.role[0]:
			  			self.$message.error('请选择权限');
			  			return
		  		}
				//修改角色 创建角色
				if(self.createDate.data!='') {
					self.formInfo['id']=self.createDate.data.id;
					self.post('api/Role/editRole', self.formInfo,
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
					self.post('api/Role/addRole', self.formInfo,
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