<template>
	<div class="create">
		<div class="templateTitle">
			{{createDate.name}}
		</div>
		<el-form :model="fromMode" :disabled="!createDate.write" label-width="120px" class="demo-ruleForm" style="width: 550px;">
		    <el-form-item label="所属项目" required>
		    	<el-input v-model="createDate.project.name" :disabled="true" placeholder="所属项目"></el-input>
		    </el-form-item>
		    <el-form-item label="产品名称" required>
		    	<el-input v-model="fromMode.name" placeholder="请输入产品名称，50字以内 " maxlength="50"></el-input>
		    </el-form-item>
		    <el-form-item label="产品类别" required>
				<el-select v-model="fromMode.product_category" style="width:130px;" placeholder="产品类型">
					<el-option
					    v-for="item in product_category"
					    :key="item"
					    :label="item"
					    :value="item">
					</el-option>
				</el-select>
				<el-select v-model="fromMode.sports_type" style="width:100px;" placeholder="运动类型">
					<el-option
					    v-for="item in sports_type"
					    :key="item"
					    :label="item"
					    :value="item">
					</el-option>
				</el-select>
			</el-form-item>
		    <el-form-item label="活动时间" required>
				<datePicker :models="time"  type="datetimerange" format="yyyy-MM-dd HH:mm:ss" v-on:timeChange='timeChange_'></datePicker>
		    </el-form-item>
			<el-form-item label="招募时间" required>
				<datePicker :models="recruit_time" v-on:timeChange='recruitTimeChange'></datePicker>
		    </el-form-item>
		    <el-form-item label="活动城市" required>
		    	<addressOption @areaChange='areaChange' :province='fromMode.province' :city='fromMode.city' :area='fromMode.area'></addressOption>
		    </el-form-item>
		    <el-form-item label="活动地址" required>
		    	<el-input v-model="fromMode.address" placeholder="请输入活动详细地址，100字以内" maxlength="100"></el-input>
		    </el-form-item>
		    <el-form-item label="团队构成" size='mini'>
		    	<template slot-scope="scope">
			    	<div class="quartersItem" v-for="(item,index) in fromMode.composition">
			    		<el-input v-model="item.quarters" placeholder="请输入岗位"></el-input>
			    		<el-input v-model="item.preson" placeholder="请输入负责人"></el-input>
			    		<i type='danger' v-if="createDate.write" v-on:click="delete_(index)" class="el-icon-error"></i>
			    	</div>
			    	<el-button type='text' v-if="createDate.write" @click="addPreson()">添加岗位</el-button>
			    </template>
		    </el-form-item>
		    <el-form-item label="产品备注">
		    	<el-input type="textarea" 
		    		v-model="fromMode.remarks" 
		    		:autosize="{ minRows: 9, maxRows: 9}"
		    		placeholder="请输入产品备注，200字以内"
		    		maxlength='200'></el-input>
		    </el-form-item>
		</el-form>
		<el-form label-width="120px" class="demo-ruleForm w500">
			<el-form-item>
		    	<el-button v-if="createDate.write" type="primary" @click="createClick()">{{createDate.name}}</el-button>
				<el-button v-on:click="back" >返回</el-button>
		    </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import addressOption from "../public/address"
	import datePicker from "../public/datePicker"
	export default{
		components: {
			addressOption,
			datePicker
		},
		data(){
			return{
				fromMode:{
					name:'',
					product_category:'',
					sports_type:'',
					s_time:'',
					e_time:'',
					recruit_etime:'',
					recruit_stime:'',
					province:'',
				    city:'',
				    area:'',
					composition:'',
					address:"",
					remarks:'',
					project_id:''
				},
				product_category:'',
				sports_type:'',
				time:'',
				recruit_time:'',
				cityOptions:[],
				
			}
		},
		props:['createDate'],
		created: function() {
			this.product_category = this.$datacenter.getData("product_spotrs").product_category
			this.sports_type = this.$datacenter.getData("product_spotrs").spotrs_type
			this.fromMode.project_id = this.createDate.project.id
			if(this.createDate.data!=''){
				var data = this.createDate.data;
				this.fromMode['id'] = data.id;
				this.fromMode.name = data.name;
				this.fromMode.product_category = data.product_category;
				this.fromMode.sports_type = data.sports_type;
				this.fromMode.province = {id:data.province_id,title:data.province};
				this.fromMode.city = {id:data.city_id,title:data.city};
				this.fromMode.area = {id:data.area_id,title:data.area};
				this.fromMode.composition = eval(data.composition);
				this.fromMode.address = data.address;
				this.fromMode.remarks = data.remarks;
				this.time = [data.s_time,data.e_time];
				this.recruit_time = [data.recruit_stime,data.recruit_etime];
				this.placeholder=''
			}
			if(this.fromMode.composition==undefined){
				this.fromMode.composition=[{quarters:'',preson:''},{quarters:'',preson:''},{quarters:'',preson:''}]
			}
		},
		methods: {
			//三级联动组件接受值
			areaChange(data){
				this.fromMode.province=data.province
				this.fromMode.city=data.city
				this.fromMode.area=data.area
			},
			recruitTimeChange(value){
				this.recruit_time = value;
			},
			timeChange_(value){
				this.time = value;
			},
			createClick(){
				//接口
				var self = this;
				switch(''){
		  			case self.fromMode.name:
			  			self.$message.error('产品名称不能为空');
			  			return
			  		case self.fromMode.product_category:
			  			self.$message.error('请选择产品类型');
			  			return
			  		case self.fromMode.sports_type:
			  			self.$message.error('请选择运动类型');
			  			return
			  		case self.time:
			  			self.$message.error('请选择活动起止时间');
			  			return
			  		case self.recruit_time:
			  			self.$message.error('请选择招募时间');
			  			return
			  		case self.fromMode.province:
			  			self.$message.error('请选择活动城市');
			  			return
			  		case self.fromMode.address:
			  			self.$message.error('请填写活动地址');
			  			return
			  		case self.fromMode.composition:
			  			self.$message.error('请填写团队构成');
			  			return
		  		}
				switch(null){
					case self.time:
			  			self.$message.error('请选择活动起止时间');
			  			return
			  		case self.recruit_time:
			  			self.$message.error('请选择招募时间');
			  			return
				}
				switch(undefined){
					case self.fromMode.composition:
			  			self.$message.error('请填写团队构成');
			  			return
				}
				if(self.createDate.data!=''){
					//修改产品
					self.postPath = 'api/product/editProduct';
				}else{
					//创建产品
					self.postPath = 'api/product/addProduct';
				}
				self.fromMode.s_time=self.time[0];
				self.fromMode.e_time=self.time[1];
				self.fromMode.recruit_stime=self.recruit_time[0];
				self.fromMode.recruit_etime=self.recruit_time[1];
				self.post(self.postPath,self.fromMode,
		  		function(data){
		  			if(data.data.code==200){
		  				self.$message.success(data.data.msg);
		  				self.back();
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			delete_(index){
				this.fromMode.composition.splice(index,1);
			},
			addPreson(){
				var self = this;
				if(self.fromMode.composition==null||self.fromMode.composition==''){
					self.fromMode.composition=[];
				}
				self.fromMode.composition.push({quarters:'',preson:''})
			},
			back(){
				this.$emit("back");
			}
		}
	}
</script>

<style>
	.quartersItem>div{width: 40%;}
	.quartersItem>i{color: #F56C6C;cursor: pointer;}
</style>