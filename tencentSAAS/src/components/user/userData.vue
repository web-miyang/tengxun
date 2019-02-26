<template>
	<div class="projectList" v-loading="loading">
		<div class="list" v-if="!createDate.type">
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-select v-model="formInline.project_id" placeholder="选择项目" @change="projectChange" style="width:140px;" clearable>
						<el-option v-for="item in project_item" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="formInline.product_id" placeholder="选择产品" @change="productChange" style="width:140px;" clearable>
						<el-option v-for="item in product_item" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.name" style="width:140px;" placeholder="用户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.phone" style="width:140px;" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.card_num" style="width:140px;" placeholder="证件号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="role_key" placeholder="查询条件" @change='roleChange' style="width:100px;" clearable>
					    <el-option
					      v-for="(item,key) in role"
					      :key="key"
					      :label="item"
					      :value="key">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="role_value" placeholder="查询内容" @change='roleValueChange' style="width:100px;" clearable>
					    <el-option
					      v-for="item in role_list"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="downExcel">导出</el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" border ref="tableSort" @sort-change="sortChange" style="width: 100%;">
				<el-table-column prop="id" label="用户编号" width="100" align="center">
				</el-table-column>
				<el-table-column prop="pLength" sortable="custom" label="涉及产品" width="105" align="center">
					<template slot-scope="scope">
				        <el-button @click="alertClick(scope.row.id,scope.row.name,scope.row.phone)" type="text">{{scope.row.product_count}}个</el-button>
				    </template>
				</el-table-column>
				<el-table-column label="姓名" width="100" align="center">
					<template slot-scope="scope">
				        <el-button @click="userClick(scope.row.id)" type="text">{{scope.row.name}}</el-button>
				    </template>
				</el-table-column>
				<el-table-column prop="phone" width="120" label="手机号" align="center">
				</el-table-column>
				<el-table-column prop="gender" width="80" label="性别" align="center">
				</el-table-column>
				<el-table-column label="证件信息" width="100" align="center">
					<template slot-scope="scope">
				        <el-button @click="cardMsg(scope.row.id,scope.row.name)" type="text">查看</el-button>
				    </template>
				</el-table-column>
				<el-table-column prop="birthday" width="120" label="出生日期" align="center">
				</el-table-column>
				<el-table-column prop="constellation" width="80" label="星座" align="center">
				</el-table-column>
				<el-table-column label="所在城市" width="180" align="center">
					<template slot-scope="scope">
						<span>{{getaddress(scope.row)}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" width="200" label="详细地址" align="center">
				</el-table-column>
				<el-table-column prop="wechat" width="120" label="微信号" align="center">
				</el-table-column>
				<el-table-column prop="qq" width="120" label="QQ号" align="center">
				</el-table-column>
				<el-table-column prop="email" width="150" label="邮箱" align="center">
				</el-table-column>
				<el-table-column prop="blood_type" width="80" label="血型" align="center">
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pageList">
				<el-pagination @current-change="handleCurrentChange" :current-page="page.index" 
					:page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
				</el-pagination>
			</div>
		</div>
		<!--查看涉及产品-->
		<el-dialog :title="user_name +' 手机号:'+ user_phone" :visible.sync="user_show" :append-to-body="true">
		  <el-table :data="user_project_msg">
		    <el-table-column property="type" label="类型" min-width="80" align="center">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.status==1?'来源产品':'参与产品'}}</span>	
		    	</template>
		    </el-table-column>
		    <el-table-column property="registration_time" label="报名时间" min-width="160" align="center"></el-table-column>
		    <el-table-column property="project_name" label="项目名称" min-width="120" align="center"></el-table-column>
		    <el-table-column property="product_name" label="产品名称" min-width="120" align="center"></el-table-column>
        <el-table-column property="order_price" label="报名费" min-width="100" align="center"></el-table-column>
		    <el-table-column label="活动时间" min-width="160" align="center">
		    	<template slot-scope="scope" >
					<span>{{scope.row.s_time}}<br/>至<br/>{{scope.row.e_time}}</span>
				</template>
		    </el-table-column>
		  </el-table>
		</el-dialog>
		<!--证件信息-->
		<el-dialog :title="user_name+'的证件信息'" :visible.sync="cardShow" width="30%">
		  <el-table :data="card_list">
		    <el-table-column property="card_type" label="证件类型" width="150" align="center"></el-table-column>
		    <el-table-column property="card_num" label="证件号" align="center"></el-table-column>
		  </el-table>
		</el-dialog>
		<createUser v-if="createDate.type" v-on:back="back" :createDate="createDate"></createUser>
	</div>
</template>

<script>
	import createUser from "./createUser"
	export default {
		components: {
			createUser
		},
		data() {
			return {
				loading:true,
				role_key:'',
				role_value:'',
				role:{},
				role_list_data:{},
				role_list:[],
				formInline: {
					project_id:'',//项目名称
					product_id: '',//产品名称
					name:'',//用户姓名
					phone:'',//手机号
					card_num: '',//证件号
					select_data:{},//搜索条件内容
					order:'',//排序 desc 降序  asc升序
					page:1
				},
				project_item:[],
				product_item:[],
				tableData: [],
				//涉及产品 弹窗 相关变量
				user_name:'',
				user_phone:'',
				user_project_msg:[],
				user_show:false,
				//查看证件 弹窗 相关变量
				card_list:[],
				cardShow:false,
				//分页变量
		        page: {
					index: 1,
					size: 10,
					count: 0
				},
				//修改用户
		        createDate:{
		            type:false,
		            data:'',
		            name:'',
		            state:'',
		            role:1
		        }
			}
		},
		created: function() {
			this.getproject();
			this.getUserSearch();
			this.getList();
		},
		methods: {
			onSubmit() {
				/*搜索*/
				this.page.index=1;
				this.$refs.tableSort.clearSort();
				this.formInline.order = '';
				this.getList();
			},
			sortChange(value){
				if(value.column!=null){
					if(value.column.order=='ascending'){
						this.formInline.order = 'asc';
					}else if(value.column.order=='descending'){
						this.formInline.order = 'desc';
					}
				}else{
					this.formInline.order = '';
				}
				this.getList();
			},
			downExcel(){
				if(this.formInline.project_id==''&&this.formInline.select_data.title==undefined){
					this.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '请选择项目产品或查询条件后再导出用户！'
			        });
				}else{
					var self = this;
					var formData = this.formInline;
					var token = self.$datacenter.getData("token");
					window.location.href=self.Link+'api/product/getUserDownloadXls?token='+token+'&data='+JSON.stringify(formData);
				}
			},
			//查看涉及产品
			alertClick(id,name,phone){
				var self = this;
		    	self.user_name = name;
		    	self.user_phone = phone;
		    	self.post('api/user/getOrderByUserId',{user_id:id},
			  	function(data){0
			  		if(data.data.code==200){
			  			self.user_project_msg=data.data.data;
              self.user_show = true;
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
		    	//self.user_project_msg = self.card_msg1;

			},
			//查看证件信息
		    cardMsg(id,name){
		    	var self = this;
		    	self.user_name = name;
		    	self.post('api/user/getUserInfoByUserId',{id:id},
			  	function(data){
			  		if(data.data.code==200){
			  			self.card_list= data.data.data.card_list;
			  			self.cardShow = true;
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
		    },
			//修改用户
			userClick(user_id){
				var self = this;
				self.post('api/user/getUserInfoByUserId',{id:user_id},
			  	function(data){
			  		if(data.data.code==200){
						self.createDate.data= data.data.data;
						self.createDate.type=true;
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
			},
			//分页
			handleCurrentChange(val) {
				this.page.index = val
				this.getList();
			},
		    back(){
		    	this.createDate.type = !this.createDate.type;
		    },
		    getList(){
		    	var self = this;
		    	self.loading=true;
		    	self.formInline.page=this.page.index;
		    	var selectUser = self.$datacenter.getData("selectUser");
				if(selectUser!=undefined){
					self.formInline.project_id = selectUser.project_id;
					self.formInline.product_id = selectUser.product_id;
				};
		    	self.post('api/User/getUserInfo',self.formInline,
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
		    },
		    getUserSearch(){
		    	var self = this;
		    	self.post('api/User/getUserSearch',{},
		  		function(data){
		  			if(data.data.code==200){
		  				self.role = data.data.data.data_key;
		  				self.role_list_data = data.data.data.data;
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
		    },
		    roleChange(value){
		    	this.role_value = '';
		    	if(value!=''){
		    		this.role_key=value;
		    		this.role_list = this.role_list_data[value];
		    	}else{
		    		this.role_list = [];
		    		this.formInline.select_data={};
		    	}
		    },
		    roleValueChange(value){
		    	if(value!=''){
		    		this.formInline.select_data={title:this.role_key,name:value}
		    	}else{
		    		this.formInline.select_data={};
		    	}
		    },
		    getproject() {
				var self = this;
				self.post('api/Project/getAllProject', {},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.project_item = data_;
							var selectUser = self.$datacenter.getData("selectUser");
							if(selectUser!=undefined){
								self.projectChange(selectUser.project_id);
							};
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			projectChange(value) {
				var self = this;
				self.post('api/product/getAllProductByProjectId', {
						project_id: value
					},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.product_item = data_;
							var selectUser = self.$datacenter.getData("selectUser");
							if(selectUser!=undefined){
								self.formInline.project_id = selectUser.project_id;
								self.formInline.product_id = selectUser.product_id;
								self.$datacenter.setData("selectUser",undefined);
							}else{
								self.formInline.product_id = '';
							};
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			productChange(value) {
				this.formInline.product_id = value;
			},
			getaddress(row){
				if(row.province==''&&row.city==''&&row.area==''){
					return ''
				}else if(row.city==''&&row.area==''){
					return row.province
				}else if(row.area==''){
					return row.province+','+row.city
				}else{
					return row.province+','+row.city+','+row.area
				}
			}
		}
	}
</script>

<style scoped>
	/deep/ .el-table .caret-wrapper{
		height: 21px;
	}
	/deep/ .el-table .sort-caret.ascending{
		top: 0;
	}
	/deep/ .el-table .sort-caret.descending{
		bottom: 0;
	}
	.pageList {
		text-align: center;
		padding-top: 20px;
	}
</style>
