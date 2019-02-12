<template>
	<div class="create">
		<div class="templateTitle">
			用户信息修改
		</div>
		<el-form label-width="150px" class="demo-ruleForm w600">
			<el-form-item label="姓名" required>
				<el-input v-model="fromMode.name" placeholder="请输入姓名" ></el-input>
			</el-form-item>
			<el-form-item label="手机号" required>
				<el-input v-model="fromMode.phone" placeholder="请输入手机号" disabled></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="fromMode.gender" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.gender"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证件类型">
				<el-select v-model="card_type" @change="setCardType" placeholder="请选择证件类型" clearable>
					<el-option v-for="item in select_data.card_type"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证件号">
				<el-input v-model="card_num" placeholder="请输入证件号" @blur="setCardNum()" :disabled="card_type==''"></el-input>
			</el-form-item>
			<el-form-item label="出生日期">
				<el-date-picker
			      v-model="fromMode.birthday"
			      type="date"
			      placeholder="选择日期">
			    </el-date-picker>
			</el-form-item>
			<el-form-item label="星座">
				<el-select v-model="fromMode.constellation" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.constellation"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所在省份">
				<el-input v-model="fromMode.province" placeholder="省" ></el-input>
		    	<!--<addressOption @areaChange='areaChange' :province='fromMode.province' :city='fromMode.city' :area='fromMode.area' type="1"></addressOption>-->
		    </el-form-item>
		    <el-form-item label="所在市" >
		    	<el-input v-model="fromMode.city" placeholder="市" ></el-input>
		    </el-form-item>
		    <el-form-item label="所在区">
				<el-input v-model="fromMode.area" placeholder="区" ></el-input>
			</el-form-item>
		    <el-form-item label="详细地址">
		    	<el-input v-model="fromMode.address" placeholder="请输入详细地址"></el-input>
		    </el-form-item>
		    <el-form-item label="微信号">
				<el-input v-model="fromMode.wechat" placeholder="请输入微信号"></el-input>
			</el-form-item>
			<el-form-item label="QQ号">
				<el-input v-model="fromMode.qq" placeholder="请输入QQ号"></el-input>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-model="fromMode.email" placeholder="请输入邮箱"></el-input>
			</el-form-item>
			<el-form-item label="血型">
				<el-select v-model="fromMode.blood_type" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.blood_type"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="社会身份">
				<el-select v-model="fromMode.identity" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.identity"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="学历状况">
				<el-select v-model="fromMode.education" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.education"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年收入">
				<el-select v-model="fromMode.income" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.income"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="婚恋状况">
				<el-select v-model="fromMode.marriage_love" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.marriage_love"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="子嗣状况">
				<el-select v-model="fromMode.offspring" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.offspring"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="通勤方式">
				<el-select v-model="fromMode.commute_type" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.commute_type"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运动偏好">
				<el-select v-model="fromMode.sport_preference" multiple placeholder="请选择">
				    <el-option
				      v-for="item in select_data.sport_preference"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="兴趣爱好">
				<el-select v-model="fromMode.hobby" multiple placeholder="请选择">
				    <el-option
				      v-for="item in select_data.hobby"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="视频付费会员">
				<el-select v-model="fromMode.video_pay" multiple placeholder="请选择">
				    <el-option
				      v-for="item in select_data.video_pay"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="资讯获取途径">
				<el-select v-model="fromMode.information" multiple placeholder="请选择">
				    <el-option
				      v-for="item in select_data.information"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运动定位">
				<el-select v-model="fromMode.motion_location" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.motion_location"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="月运动频次">
				<el-select v-model="fromMode.motion_sum" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.motion_sum"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运动最大支出类型">
				<el-select v-model="fromMode.max_expenditure" placeholder="请选择">
				    <el-option
				      v-for="item in select_data.max_expenditure"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年运动花费金额">
				<el-select v-model="fromMode.year_price" placeholder="请选择">
				    <el-option
				      v-for="item in select_data.year_price"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="身体状况">
				<el-select v-model="fromMode.physical_condition" placeholder="请选择">
				    <el-option
				      v-for="item in select_data.physical_condition"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="喜欢的运动品牌">
				<el-select v-model="fromMode.like_sport_brand" multiple placeholder="请选择">
				    <el-option
				      v-for="item in select_data.like_sport_brand"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年活动参与次数">
				<el-select v-model="fromMode.match_sum" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.match_sum"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="喜欢的明星">
				<tabtag :data='fromMode.like_stars'></tabtag>
			</el-form-item>
			<el-form-item label="娱乐视频类型">
				<el-select v-model="fromMode.entertainment_type" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.entertainment_type"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="喜欢的游戏类型">
				<el-select v-model="fromMode.game_type" placeholder="请选择" clearable>
					<el-option v-for="item in select_data.game_type"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="支持的战队">
				<tabtag :data='fromMode.combat_team'></tabtag>
			</el-form-item>
			<el-form-item label="支持的球队">
				<tabtag :data='fromMode.support_team'></tabtag>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="createClick()">保存</el-button>
				<el-button v-on:click="back">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	/*import addressOption from "../public/address"*/
	import tabtag from "../public/tabTag"
	export default {
		components: {
			tabtag,
			/*addressOption*/
		},
		data() {
			return {
				fromMode: {},
				card_num:'',
				card_type:'',
				rule:false,
				showPass: true,
				//下拉选择项
				select_data:{
					gender:[],//性别
					blood_type:[],//血型
					card_type:[],//证件类型
					identity:[],//社会身份
					income:[],//年收入
					constellation:[],//星座
					education:[],//学历
					marriage_love:[],//婚恋状况
					offspring:[],//子嗣状况
					commute_type:[],//通勤方式
					sport_preference:[],//运动偏好
					hobby:[],//兴趣爱好
					video_pay:[],//视频付费会员
					information:[],//资讯获取途径
					motion_location:[],//运动定位
					max_expenditure:[],//运动最大支出类型
					year_price:[],//年运动花费金额
					like_sport_brand:[],//喜欢的运动品牌
					entertainment_type:[],//娱乐视频类型
					game_type:[],//喜欢的游戏类型
					match_sum:[],//年活动参与次数
					motion_sum:[],//月运动次数
					physical_condition:[]//身体状况
				}
			}
		},
		props: ['createDate'],
		created: function() {
			this.getSelection();
			this.fromMode = this.createDate.data
			this.card_type = '身份证';
			var card_item = this.fromMode.card_list;
			for(var z=0;z<card_item.length;z++){
				if(card_item[z].card_type=='身份证'){
					this.card_num = card_item[z].card_num
				}else{
					this.card_num = '';
				}
			}
		},
		methods: {
			/*//三级联动组件接受值
			areaChange(data){
				this.fromMode.province=data.province
				this.fromMode.city=data.city
				this.fromMode.area=data.area
			},*/
			back() {
				this.$emit("back");
			},
			createClick() {
				var self = this;
				var card_item = self.fromMode.card_list;
				switch(''){
		  			case self.fromMode.account:
			  			self.$message.error('账号不能为空');
			  			return
		  			case self.fromMode.name:
			  			self.$message.error('姓名不能为空');
			  			return
		  		}
				for(var i=0;i<card_item.length;i++){
					if(card_item[i].card_num==''){
						card_item.splice(i,1);
					}
				}
		  		self.post('api/user/editUserInfo',self.fromMode,
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
			getSelection(){
				var self = this;
				self.post('api/user/getSelection',{},
			  	function(data){
			  		if(data.data.code==200){
			  			self.select_data = data.data.data;
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
			},
			setCardType(value){
				if(value!=''){
					this.card_type = value;
					var card_item = this.fromMode.card_list;
					for(var z=0;z<card_item.length;z++){
						if(card_item[z].card_type==this.card_type){
							this.card_num = card_item[z].card_num
							return;
						}
					}
					this.card_num='';
					card_item.push({card_type:this.card_type,card_num:this.card_num});
				}
			},
			setCardNum(){
				var card_item = this.fromMode.card_list;
				for(var z=0;z<card_item.length;z++){
					if(card_item[z].card_type == this.card_type){
						card_item[z].card_num = this.card_num;
					}
				}
			}
		}
	}
</script>

<style scoped>
	.el-select{width:100%;}
</style>