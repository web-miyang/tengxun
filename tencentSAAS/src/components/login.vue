<template>
  <div class="login">
    <div class="content">
    	<div class="login_text">
    		<i>赛事中心赛事管理系统</i>
    	</div>
    	<div class="form-wrap">
    		<div class="form">
    			<div class="tab-btn" @click="tabClick">
    				<div class="tabIconWrap">
    					<div class="tabIcon" :class="loginTab?'':'tabIconCode'">
    						<img src="../../static/img/u18.png"/>
    						<img src="../../static/img/u20.png"/>
    					</div>
    				</div>
    			</div>
    			<div class="form-title">{{loginTab?"账号登录":"微信登录"}}</div>
    			<div class="loginContent">
    				<transition name="el-zoom-in-top">
		        <el-form class="tabN" v-show="loginTab" :label-position="labelPosition" :model="loginForm">
						  <el-form-item label="登录账号">
						    <el-input class="user_name" v-model="loginForm.account" placeholder="请输入登录账号"></el-input>
						  </el-form-item>
						  <el-form-item label="登录密码">
						    <el-input class="password" type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="submitForm"></el-input>
						  </el-form-item>
						  <el-form-item>
						  	<el-button class="sub_btn" type="primary" @click="submitForm()" >登录</el-button>
						  </el-form-item>
						</el-form>
		      </transition>
    			<transition name="el-zoom-in-bottom">
		        <div v-show="!loginTab" class="tabC">
		        	<img src="../../static/img/u34.png"/>
		        	<p>请使用微信扫描二维码</p>
		        </div>
		      </transition>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
    	loginTab:true,
    	labelPosition:'top',
      loginForm:{
      	account:'',
      	password:''
      }
    }
  },
  created:function(){
  	this.$datacenter.setData("token",undefined);
  },
  methods:{
  	submitForm() {
  		var self = this;
  		switch(''){
  			case self.loginForm.account:
	  			self.$message.error('登录账号不能为空');
	  			return
  			case self.loginForm.password:
	  			self.$message.error('登录密码不能为空');
	  			return
  		}
  		self.post('api/login/checklogin',self.loginForm,
  		function(data){
  			if(data.data.code==200){
  				self.$datacenter.setData("token", data.data.data.token);
  				self.$router.push({path: '/home'});
  			}else{
  				self.$message.error(data.data.msg);
  			}
  		},function(error){
  		});
	  },
	  tabClick(){
	  	var self = this;
	  	self.loginTab = !self.loginTab;
	  }
  }
}
</script>
<style scoped>
	.login{position:relative;
	left:0;top:0;width:100%;height: 100%;
	min-width: 1500px;overflow-x: auto;
	background-image: url('../../static/img/login_bg.png');
	background-repeat: no-repeat;
	background-size: cover;}
	.content .login_text{position: absolute;top:50%;left: 10%;transform: translateY(-50%);font-size: 61px;color: #fefefe;font-weight: 600;}
  .content .login_text .en{font-size: 49px;font-weight: 100;}
  .login .content{position:relative;height:100%;min-height:570px;}
	.content img{width: 100%;}
	
	.form-wrap{
		width: 560px;height: 513px;
		background-image: url('../../static/img/frome_bg.png');
		background-repeat: no-repeat;
	background-size: 105%;
	background-position: center;
		position: absolute;right: 10%;top: 50%;
		transform: translateY(-50%);}
	.form{padding: 0 62px;position: relative;}
	.form-title{font-size: 30px;color: #fff;padding:56px 25px 36px;text-align: center;}
	.loginContent{position: relative;}
	.tabN,.tabC{position: absolute;top: 0;left: 0;width: 100%;}
	.tabC{text-align: center;color: #606266;}
	.tabC img{width: 230px;height: auto;}
	/deep/ .el-form-item__label{line-height: 25px;font-size: 24px;font-weight: 600;color: #fff!important;}
	/deep/ .el-form--label-top .el-form-item__label{padding: 0 0 16px;}
	/deep/ .el-input{background-color:#04232a;border-radius: 5px;}
	/deep/ .user_name .el-input__inner{background-image: url('../../static/img/user_input.png');background-repeat:no-repeat;background-position: 390px;}
	/deep/ .password .el-input__inner{background-image: url('../../static/img/pass_input.png');background-repeat:no-repeat;background-position: 390px;}
	/deep/ .el-input__inner{border:none;height: 50px;font-size: 22px;color: #23b7e5;padding: 0 50px 0 15px;}
	.sub_btn{width: 100%;font-size: 18px;margin-top:50px;background-color: #23b7e5;border-color: #23b7e5;}
	/*.sub_btn:hover{opacity:.9}*/
	.tab-btn{position: absolute;right:29px;top:29px;width: 50px;height: 50px;cursor: pointer;}
	.tabIconWrap{position: relative;overflow: hidden;width: 100%;height: 100%;}
	.tabIcon{padding:5px;box-sizing:border-box;position: absolute;top: 0;transition: all .2s linear;}
	.tabIconCode{top: -50px;}
	.tabIcon img{width: 100%;height: 45px;}
</style>
