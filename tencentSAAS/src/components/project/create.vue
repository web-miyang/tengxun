<template>
	<div class="create">
		<div class="templateTitle">
			{{createDate.name}}
		</div>
		<el-form :model="fromMode" label-width="120px" class="demo-ruleForm w500">
		  <el-form-item label="项目名称" required>
		    <el-input v-model="fromMode.name" maxlength="50" placeholder="请输入项目名称，50字以内"></el-input>
		  </el-form-item>
		  <el-form-item label="起止时间" required>
				<datePicker :models="time" v-on:timeChange='timeChange'></datePicker>
		  </el-form-item>
		  <el-form-item label="项目备注">
		    <el-input type="textarea"
		    	v-model="fromMode.remarks"
		    	:autosize="{ minRows: 9, maxRows: 9}"
		    	placeholder="请输入项目备注，200字以内" 
		    	maxlength="200"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="createClick()">{{createDate.name}}</el-button>
		    <el-button v-on:click="back">返回</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import datePicker from "../public/datePicker";
	export default{
		components: {
			datePicker
		},
		data(){
			return{
				fromMode:{
					name:'',
					s_time:'',
					e_time:'',
					remarks:''
				},
				id:'',
				time:'',
				postPath:''
			}
		},
		props:['createDate'],
		created: function() {
			var self = this;
			if(self.createDate.data!=''){
				self.id = self.createDate.data.id;
				self.fromMode.name = self.createDate.data.name;
				self.fromMode.remarks = self.createDate.data.remarks;
				self.time = [self.createDate.data.s_time, self.createDate.data.e_time];
			}
		},
		methods: {
			timeChange(value){
				this.time = value;
			},
			createClick(){
				//接口
				var self = this;
				switch(''){
		  			case self.fromMode.name:
			  			self.$message.error('项目名称不能为空');
			  			return
		  			case self.time:
			  			self.$message.error('请选择起止时间');
			  			return
		  		}
				if(self.createDate.data!=''){
					//修改项目
					self.fromMode['id'] = self.id;
					self.postPath = 'api/Project/editProject';
				}else{
					//创建项目
					self.postPath = 'api/Project/addProject';
				}
				self.fromMode.s_time=self.time[0];
				self.fromMode.e_time=self.time[1];
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
			back(){
				this.$emit("back");
			}
		}
	}
</script>

<style>
</style>