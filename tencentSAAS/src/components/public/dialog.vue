<template>
	<div class="dialog">
		<!--<el-tooltip :content="numState(scope)" placement="top">
				        <el-switch
				          v-model="scope.row.status"
				          active-color-color="#00A854"
				          :active-value='1'
				          inactive-color="#F04134"
				          :inactive-value='2'
				          @click.native="scope.row.status==2?changeSwitch(scope.row):changeTrue(postUrl,scope.row)">
				        </el-switch>
				        </el-tooltip>-->
		<el-button @click.native="changeSwitch(scope.row,postUrl)" :class="scope.row.status==1?'':'text_red'" type="text">
			{{scope.row.status==1?'启用中':'已禁用'}}
		</el-button>
		<el-dialog
		  title="提示"
		  :visible.sync="dialog.show"
		  width="30%"
		  center>
		  <span>您确定要{{changeStatus==2?'禁用':'启用'}}{{dialog.data.name}}吗?</span>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="changeTrue(postUrl)">确 定</el-button>
		    <el-button @click="dialog.show = false">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				changeStatus:'',
				dialog:{
		        	show:false,
		        	data:''
		        }
			}
		},
		props:['scope','postUrl'],
		methods:{
			changeSwitch(row,postUrl){
				/*改变状态*/
				/*this.changeStatus = row.status
				this.dialog={
					show:true,
			        data:row
				};
				if(row.status==1){
					row.status=2;
				}else if(row.status==2){
					row.status=1;
					
				}*/
				this.dialog.data = row;
				if(row.status==1){
					this.changeStatus = 2
					this.dialog.show=true;
				}else{
					this.changeStatus = 1;
					this.changeTrue(postUrl);
				}
				
			},
			numState(scorp){
		    	return scorp.row.status=='1'?'已开启': '已禁用';
		    },
			changeTrue(postUrl,row){
				var self = this;
				if(row){
					self.changeStatus=row.status;
					self.dialog.data=row;
				}
				self.post(postUrl,{
					status: self.changeStatus,id: self.dialog.data.id
				},
		  		function(data){
		  			self.dialog.show=false;
		  			if(data.data.code==200){
		  				self.dialog.data.status=self.changeStatus;
		  				self.$message.success(data.data.msg);
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
</style>