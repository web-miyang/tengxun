<template>
	<div class="product" v-loading="loading">
		<div class="list" v-if="!createDate.type">
			<div class="tip-title">
				{{product.name}}
			</div>
			<el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="onSubmit">
				<el-form-item>
					<el-select v-model="formInline.status" style="width:100px;" :value="formInline.state" placeholder="产品状态" clearable>
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="formInline.product_category" style="width:120px;" :value="formInline.product_category" placeholder="产品类型" clearable>
						<el-option
					      v-for="(item,index) in product_category"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="formInline.sports_type" style="width:120px;" :value="formInline.sports_type" placeholder="运动类型" clearable>
						<el-option
					      v-for="(item,index) in sports_type"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.product_num" style="width:140px;" placeholder="产品编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.name" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<datePicker :models="time" placeholder='活动' v-on:timeChange='timeChange'></datePicker>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formInline.admin_name" style="width:100px;" placeholder="产品创建人"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="setClick('')">创建产品</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" ><a :href="Link+'api/Planning/download'">模板下载</a></el-button>
				</el-form-item>
			</el-form>
			<!--列表-->
			<el-table :data="tableData" border style="width: 100%;">
				<el-table-column prop="product_num" width="150" label="产品编号" align="center">
				</el-table-column>
				<el-table-column label="产品名称" align="center">
					<template slot-scope="scope">
						<el-button @click="setClick(scope.row,false)" type="text">{{scope.row.name}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="查看用户" width="80" align="center">
					<template slot-scope="scope">
						<el-button @click="look(scope.row)" type="text">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="product_category" width="120" label="产品类型" align="center">
				</el-table-column>
				<el-table-column prop="sports_type" width="80" label="运动类型" align="center">
				</el-table-column>
				<el-table-column width="180" label="活动时间" align="center">
					<template slot-scope="scope">
						<p>{{scope.row.s_time}}</p>至<p>{{scope.row.e_time}}</p>
					</template>
				</el-table-column>
				<el-table-column width="120" label="招募时间" align="center">
					<template slot-scope="scope">
						<p>{{scope.row.recruit_stime}}</p>至<p>{{scope.row.recruit_etime}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="admin_name" width="100" label="产品创建人" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" width="150" >
					<template slot-scope="scope">
						<upload v-if='scope.row.status==1' :btn_text='uploadText' :id="scope.row.id" :upload_url='uploadUrl'></upload>
						<el-button @click="setClick(scope.row,true)" type="primary" plain size="mini">修改</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" width="80" >
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
		<createProduct v-if="createDate.type" v-on:back="back" :createDate="createDate"></createProduct>
	</div>
</template>

<script>
	import createProduct from "./createProduct";
	import switchEl from "../public/dialog";
	import upload from "../public/upload";
	import datePicker from "../public/datePicker";
	export default {
		components: {
			createProduct,
			switchEl,
			upload,
			datePicker
		},
		data() {
			return {
				loading:true,
				formInline: {
					project_id:'',
					product_category:'',
					sports_type:'',
					product_num:'',
					name: '',
					s_time: '',
					e_time: '',
					page:'',
					admin_name: ''
				},
				time:'',
				product_category:'',
				sports_type:'',
				status: '',
				tableData: [/*{
						id: 1,
						product_num: "123",
						name: "产品1",
						s_time:'2016-05-02',
						e_time:'2016-06-03',
						product_category:'活动类-报名',
						sports_type:'跑步',
						recruit_stime:'2016-04-01',
						recruit_etime:'2016-05-01',
						admin_name:'张三',
						province:'河北省',
						city:'石家庄市',
						area:'新华区',
						address: '金沙江路 1518 号',
						remarks:'备注备注备注备注，备注备注',
						status: 1
					}*/
				],
				page: {
					index: 1,
					size: 10,
					count: 0
				},
				createDate: {
					type:false,
					data:'',
					name:'',
					write:'',
					project:''
				},
				product:'',
				switchPostUrl:'api/product/changeProductStatus',
				uploadUrl:'api/Importexport/doUpload',
				uploadText:'导入'
			}
		},
		created: function() {
			var product = this.$datacenter.getData("product");
			if(product==null||product==undefined){
				this.$router.push({name: '/project/projectList'});
				return;
			}
			this.product = product;
			this.createDate.project = this.product;
			this.getList();
			//获取产品类型 存入缓存
			this.getProductType();
		},
		methods: {
			timeChange(value){
				this.time = value;
			},
			onSubmit() {/*搜索*/
				this.page.index = 1;
				this.getList();
			},
			//创建、修改项目
			setClick(row,write) {
				if(row=='') {
					if(this.product.status==2){
						this.$message.warning('该项目已禁用，无法创建产品!');
						return;
					}else{
						this.createDate.type = true;
						this.createDate.name = '新建产品';
						this.createDate.data = '';
						this.createDate.write = true;	
					}
				} else {
					this.createDate.type = true;
					if(write){
						this.createDate.name = '修改产品';
						this.createDate.data = row;
						this.createDate.write = write;
					}else{
						this.createDate.name = '查看产品信息';
						this.createDate.data = row;
						this.createDate.write = write;
					}
				}
			},
			//跳转路由
			look(row) {
				var self = this;
				var item = self.$datacenter.getData("router")[1];
				this.$emit('lookUser',item);
				self.$datacenter.setData("selectUser", 
				{
					project_id:self.product.id,
					product_id:row.id
				});
			},
			//分页
			handleCurrentChange(val) {
				this.page.index = val;
				this.getList();
			},
			back() {
				this.createDate.type = !this.createDate.type;
				this.getList();
			},
			downClick(){
				self.post('api/Importexport/download',{},
		  		function(data){
		  			if(data.data.code==200){
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			getList(){
				var self = this;
				self.loading=true;
				self.formInline.project_id = self.product.id;
				self.formInline.page=self.page.index;
				if(self.time!=null){
					self.formInline.s_time = self.time[0];
					self.formInline.e_time = self.time[1];
				}else{
					self.formInline.s_time = '';
					self.formInline.e_time = '';
				}
				self.post('api/product/getProductByprojectId',self.formInline,
		  		function(data){
		  			if(data.data.code==200){
		  				self.page.count = data.data.data.count;
		  				self.tableData = data.data.data.data;
		  				self.loading=false;
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			//获取运动类型
			getProductType(){
				var self = this;
				self.post('api/product/getProductType',{},
		  		function(data){
		  			if(data.data.code==200){
		  				self.product_category = data.data.data.product_category
		  				self.sports_type = data.data.data.spotrs_type
		  				self.$datacenter.setData("product_spotrs",data.data.data);
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			}
		}
	}
</script>

<style>
	.uploat_btn{display: inline-block;}
	.tip-title{padding-left:16px;font-size: 16px;color: #666;}
</style>
