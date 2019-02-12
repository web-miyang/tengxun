<template>
	<div class="setRepeat">
		<div class="repeat_title">
			用户：{{createDate.userData.name}} 手机号：{{createDate.userData.phone}}
			<!--<p class="repeat_tip">以下重复信息以首行数据为参照</p>-->
		</div>
		<!--列表-->
		<el-table :data="createDate.repeatData">
			<el-table-column v-for="(value,key) in createDate.repeatTitle" :label="value" :key="key" align="center" :fixed="getFixed(value)">
				<template slot-scope="scope">
					<span :class="getClass(scope.row,key)" @click="setRepeatClick(scope.row,key)">{{getShowValue(scope.row,key)}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-form class="btnItem">
			<el-form-item>
		    	<el-button type="primary" @click="createClick()">确认修改</el-button>
				<el-button v-on:click="back" >返回</el-button>
		    </el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				data_:null,
				postData:null
			}
		},
		props:['createDate'],
		created:function(){
			var data = {};
			var postData = {};
			for(var key_ in this.createDate.repeatTitle){
				if(key_!="order_time"&&key_!="product_name")
				{
					data[key_]='';
					postData[key_]='';
				}
			}
			this.data_ = data;
			this.postData = postData;
		},
		methods:{
			getClass(row,key){
				var class_ = ''
				if(key=="order_time"||key=="product_name")
				{
					class_="";
				}else{
					class_="user_btn ";
					if(this.data_[key]==row)
					{
						class_+="activeBtn";
					}
				}
				return class_
			},
			getShowValue(row,key){
				return row[key];
			},
			setRepeatClick(row,key){
				if(key!="order_time"&&key!="product_name")
				{/*row.is_click==this.data_[key].is_click||*/
					if(this.data_[key] == row){
						this.postData[key]='';
						this.data_[key]='';	
					}else{
						this.postData[key]=row[key];
						this.data_[key]=row;
					}
				}
			},
			createClick(){
				var self = this;
				for(var key in self.postData){
					if(self.postData[key]==''){
						delete self.postData[key]
					}
				}
				if(JSON.stringify(self.postData)=='{}'){
					self.$message.error('请选择重复信息！');
					return;
				}
				self.postData['user_id']=self.createDate.userData.id
				self.post('api/User/editRepeatMessage',self.postData,
		  		function(data){
		  			if(data.data.code==200){
		  				self.$message.success("保存成功！")
		  				self.back();
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			getFixed(value){
				if(value=='order_time'||value=='product_name'){return true}
			},
			back(){
				this.$emit("back");
			}
		}
	}
</script>

<style scoped>
	.repeat_title{padding:20px 10px;font-size: 18px;font-weight: 600;color: #222;}
	.repeat_tip{font-size: 15px;font-weight: 500;}
	.user_btn{width: 100%;height: 100%;cursor: pointer;}
	.activeBtn{color:#409EFF}
	.btnItem{text-align: center;margin-top: 20px;}
</style>