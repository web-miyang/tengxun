<template>
	<div class="home">
		<div class="header cl">
			<div class="logo fl">
    			<img src="../../static/img/u4.2.png"/>
	    	</div>
	    	<div class="header_title fl">
	    		赛事中心项目管理
	    	</div>
	    	<el-dropdown class="fr user_name" @command="setOut">
		    	<span class="el-dropdown-link">{{userName}}<i class="el-icon-caret-bottom"></i></span>
		    	<el-dropdown-menu class="slotDown" slot="dropdown">
	        		<el-dropdown-item>退出</el-dropdown-item>
	        	</el-dropdown-menu>
		    </el-dropdown>
		</div>
		<div class="body-wrap">
			<div class="body cl">
				<div class="home_nav fl" v-for='(item,index) in navData' @mouseenter="enter(index)" @mouseleave="leav()">
					<transition name="el-zoom-in-top">
						<div v-show="!(index==current)" class="iconWrap">
							<img class="icon" :src="imgArr[index]"/>
							<p class="nav_title">{{item.title}}</p>
						</div>
					</transition>
					<img class="iconBg" :src="imgArrBg[index]"/>
					<transition name="el-zoom-in-bottom">
						<ul v-show="tran&&index==current" class="navText">
							<li v-for='(citem,index) in item.info' class="child_text" @click="navTab(citem)"><span class="child_text_span">{{citem.title}}</span></li>
						</ul>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				userName:"用户名",
				tran:false,
				current:null,
				navData:[],
				imgArr:[
				'static/img/icon-1.png',
				'static/img/icon-2.png',
				'static/img/icon-3.png',
				'static/img/icon-4.png',
				'static/img/icon-5.png',
				],
				imgArrBg:[
				'static/img/icon-1-b.png',
				'static/img/icon-2-b.png',
				'static/img/icon-3-b.png',
				'static/img/icon-4-b.png',
				'static/img/icon-5-b.png',
				]
			}
		},
		created:function (){
			this.getnav();
		},
		methods:{
			setOut(){
				var self = this;
				self.post('api/login/outLogin',{},
		  		function(data){
		  			if(data.data.code==200){
		  				self.$datacenter.setData("token",undefined);
		  				self.$router.push({path: '/login'});
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			enter(index){
				this.tran = true;
				this.current = index;
			},
			leav(){
				this.tran = false;
				this.current=null;
			},
			navTab(citem){
				this.$datacenter.setData("inCRouter", citem);//保存当前子级导航
				this.$router.push({name: citem.link_address});
			},
			getnav(){
				var self = this;
				if(self.$datacenter.getData("token")==undefined){
					self.$router.push({path: '/login'});
				}else{
					var self = this;
					self.post('api/index/index',{},
			  		function(data){
			  			if(data.data.code==200){
			  				self.navData = data.data.data.data;
			  				self.userName = data.data.data.user_info.name
			  				self.$datacenter.setData("userInfo", data.data.data.user_info);
			  				self.$datacenter.setData("router", data.data.data.data);
			  			}else{
			  				self.$message.error(data.data.msg);
			  			}
			  		},function(error){
			  		});
				}
			}
		}
	}
</script>

<style scoped>
	.home{min-width:1300px;height: 100%;width: 100%;position: relative;/*overflow: hidden;*/}
	.home .header{height:70px;box-sizing:border-box;padding:10px 10%;background: #282d30;}
	.home .header .header_title{line-height:50px;font-size: 16px;color: #fff;padding-left: 20px;}
	.home .logo{display: inline-block;height: 100%;border-right: 2px solid #fff;}
	.home .logo img{height: 100%;width: auto;}
	.user_name{height:100%;line-height:50px;font-size: 20px;color: #fff;margin-right: 30px;cursor: pointer;}
	.el-icon-caret-bottom{color: #1b96d5;font-size: 22px;margin-left: 13px;}
	.slotDown{width: 100px;}
	.el-dropdown-menu__item{font-size: 18px;text-align: center;}
	.home .body-wrap{box-sizing:border-box;height: calc(100% - 84px);width: 80%;margin: 0 auto;padding: 50px 0;}
	.home_nav{width: 30%;height:280px;margin: 1.5%;box-sizing: border-box;text-align: center;padding: 105px 0 55px;position: relative;background: #fff;box-shadow: 0 0 15px #ccc;border-radius: 5px;}
	.home_nav .iconBg{position: absolute;left: 50%;top: 50%;width: 35%;height: auto;transform: translate(-50%,-50%);}
	.home_nav .icon{width: 80px;height: auto;}
	.home .nav_title{font-size: 18px;color: #2c314b;opacity:.8;font-weight: 600;margin-top: 15px;}
	.home_nav .navText{
		list-style:none;position: absolute;
		top: 50%;left: 50%;transform: translate(-50%,-50%);
		font-size: 30px;color: #2c314b;
		line-height: 40px;text-align: center;
		list-style: initial;}
	.navText .child_text{cursor: pointer;font-size: 20px;color: #1b96d5;}
	.navText .child_text .child_text_span{font-size: 18px;color: #2c314b;}
	.child_text:hover{text-decoration: underline;}
</style>