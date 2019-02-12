<template>
	<div class="projectList" v-loading='loading'>
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
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column prop="id" label="用户编号" align="center">
				</el-table-column>
				<el-table-column label="姓名" width="100" align="center">
					<template slot-scope="scope">
				        <el-button @click="userClick" type="text">{{scope.row.name}}</el-button>
				    </template>
				</el-table-column>
				<el-table-column prop="phone" width="120" label="手机号" align="center">
				</el-table-column>
				<el-table-column prop="motion_location" width="90" label="运动定位" align="center">
				</el-table-column>
				<el-table-column prop="motion_sum" width="100" label="月运动频次" align="center">
				</el-table-column>
				<el-table-column prop="max_expenditure" width="135" label="运动最大支出类型" align="center">
				</el-table-column>
				<el-table-column prop="year_price" width="120" label="年运动花费金额" align="center">
				</el-table-column>
				<el-table-column prop="physical_condition" width="80" label="身体状况" align="center">
				</el-table-column>
				<el-table-column prop="like_sport_brand" min-width="100" label="喜欢的运动品牌" align="center">
				</el-table-column>
				<el-table-column prop="match_sum" width="120" label="年赛事参与次数" align="center">
				</el-table-column>
				<el-table-column prop="like_stars" label="喜欢的明星" align="center">
				</el-table-column>
				<el-table-column prop="entertainment_type" width="110" label="娱乐视频类型" align="center">
				</el-table-column>
				<el-table-column prop="game_type" width="120" label="喜欢的游戏类型" align="center">
				</el-table-column>
				<el-table-column prop="combat_team" min-width="90" label="支持战队" align="center">
				</el-table-column>
				<el-table-column prop="support_team" min-width="90" label="支持球队" align="center">
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pageList">
				<el-pagination @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
				</el-pagination>
			</div>
		</div>
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
					page:1
				},
				project_item:[],
				product_item:[],
				tableData: [],
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
			//修改用户
			userClick(user_data){
				this.createDate.type=true;
				this.createDate.data=user_data;
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
		    	self.post('api/User/getUserInfo',self.formInline,
			  	function(data){
			  		if(data.data.code==200){
			  			self.tableData = data.data.data.data;
			  			self.page.count = data.data.data.count;
			  			self.loading=false;
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
		    },
		    getproject() {
				var self = this;
				self.post('api/Project/getAllProject', {},
					function(data) {
						if(data.data.code == 200) {
							var data_ = data.data.data;
							self.project_item = data_
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
							self.product_item = data_
							self.formInline.product_id = '';
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			productChange(value) {
				this.formInline.product_id = value;
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
		    }
		}
	}
</script>

<style scoped>
	.pageList {
		text-align: center;
		padding-top: 20px;
	}
</style>