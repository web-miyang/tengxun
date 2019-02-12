<template>
	<div class="home">
		  <div class="nav_left">
		  	<div class="logo_box">
		  		<img @click="go_home" class="logo" src="../../static/img/u4.2.png"/>
		  	</div>
		  	<div class="nav_item" v-for='(item,index) in navData' @click="navTab_(item)" :class="getPClass(item)">
				<img class="icon" :src="imgArr[index]" />
				<span class="nav_title">{{item.title}}</span>
				<div class="right_border"></div>
			</div>
			<div class="postion_text">
				<div class="info_text">
					<i>赛事中心赛事管理系统</i>
				</div>
			</div>
		  </div>
		  <div class="content_right">
		    <div class="nav_header cl">
		    	<div class="childNav fl">
					<span class="childNavText" 
						v-for='(child,index) in inRouter.info' 
						:class="getCClass(child.id)" 
						@click="navTab_(inRouter,child)">
						<span class="titleBorder">{{child.title}}</span>
					</span>
				</div>
				<el-dropdown class="fr user_name" @command="setOut">
		    		<span class="el-dropdown-link">{{userName}}<i class="el-icon-caret-bottom"></i></span>
		    		<el-dropdown-menu class="slotDown" slot="dropdown">
	        			<el-dropdown-item>退出</el-dropdown-item>
	        		</el-dropdown-menu>
		    	</el-dropdown>
		    </div>
		    <div class="content">
		    	<router-view v-on:lookUser='navTab_' :item='inRouter'></router-view>
		    </div>
		  </div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				userName:"用户名",
				inCRouter:{},
				inRouter:{},
				navData:[],
				imgArr:[
				'static/img/icon1.png',
				'static/img/icon2.png',
				'static/img/icon3.png',
				'static/img/icon4.png',
				'static/img/icon5.png',
				]
			}
		},
		created:function (){
			var self = this;
			if(self.$datacenter.getData("token")==undefined){
				self.$router.push({path: '/login'});
			}else{
				self.userName = self.$datacenter.getData("userInfo").name;
				self.navData = self.$datacenter.getData("router");
				self.inCRouter = self.$datacenter.getData("inCRouter");
				for (var i=0;i<self.navData.length;i++) {
					if(self.navData[i].id==self.inCRouter.pid){
						self.inRouter = self.navData[i];
					}
				}
			}
		},
		watch:{
			'$route.path':function(newVal,oldVal){
				var navList = this.navData;
				for (var i=0;i<navList.length;i++) {
					var navClist = navList[i].info;
					for(var z=0;z<navClist.length;z++){
						if(newVal==navClist[z].link_address){
							this.inRouter = navList[i];
							this.inCRouter = navClist[z];
							this.$datacenter.setData("inCRouter", navClist[z]);
						}
					}
				}
			}
		},
		methods:{
			setOut(){
				var self = this;
				self.post('api/login/outLogin',{},
		  		function(data){
		  			if(data.data.code==200){
		  				self.$datacenter.setData({'token':undefined});
		  				self.$router.push({path: '/login'});
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			navTab_(item,child){
				this.inRouter = item;
				if(!child){
					var child_ = item.info[0];
				}else{
					var child_ = child;
				}
				this.inCRouter = child_;
				this.$datacenter.setData("inCRouter", child_);
				this.$router.push({path: child_.link_address});
			},
			getPClass(item){
				if(this.inCRouter.pid == item.id){
					return 'inNav'
				}else{
					return ''
				}
			},
			getCClass(id){
				if(id==this.inCRouter.id){
					return 'navActive'
				} else{
					return ''
				}
			},
			go_home(){
				this.$router.push({path: '/home'});
			}
		}
	}
</script>

<style scoped>
	.home{display: flex;background: #e1e5e8;overflow: hidden;height: 100%;margin-right: -20px/*no*/;}
	.nav_left{position:fixed;z-index:20; flex:274px 0 0;width:274px;height: 100%;overflow: auto;background: #282d30;color: #fff;}
	.content_right{width: 100%;height:100%;overflow-y: auto;overflow-x: hidden;}
	.nav_header{min-width: 1400px;}
	.logo_box{height: 216px;text-align: center;}
	.logo_box .logo{width: 189px;height: 48px;margin-top: 89px;/*px*/cursor: pointer;}
	.nav_item{height: 70px;line-height: 80px;font-size: 20px;cursor: pointer;}
	.nav_item .icon{width: 26px;line-height:70px;margin: 0 15px 0 31px;}
	.nav_title{display:inline-block;height:70px;line-height:70px;vertical-align: top;}
	.nav_item.inNav,.nav_item:hover{background-color: #1f292b;background-image: url(../../static/img/nav_bg.png) ;background-repeat: no-repeat;background-position: right;}
	.nav_header{box-sizing: border-box;width: 100%;height: 70px;line-height: 70px;background: #fff;padding: 0 35px;font-size: 22px;color: #484e5e;position: fixed;top: 0;z-index: 19;box-shadow: 0 0 12px 0 rgba(0,0,0,.1);}
    .postion_text{position: relative;left:0;height:calc(100% - 620px);min-height: 80px;margin-top: 30px;}
    .info_text{position:absolute;left:0;bottom:40px;width:100%;color: #fff;text-align: center;}
    .childNav{margin-left: 274px;}
	.childNavText{display: inline-block;box-sizing: border-box;height: 70px;text-align: center;cursor: pointer;}
    .titleBorder{padding: 0 30px;box-sizing: border-box;border-right:1px solid #999;}
    .childNavText:last-child .titleBorder{border-right: none;}
	.childNavText.navActive{background-image: url(../../static/img/nav_bg2.png);background-repeat: no-repeat;background-position: bottom;}
	.user_name{height:45px;font-size: 22px;color: #282d30;margin-right: 30px;cursor: pointer;}
	.el-icon-caret-bottom{color: #1b96d5;font-size: 22px;margin-left: 13px;}
	.slotDown{width: 100px;}
	.el-dropdown-menu__item{font-size: 18px;text-align: center;}
	.content{position: relative;box-sizing: border-box;margin: 70px 0 0 274px;padding: 10px 38px 20px 20px;}
</style>