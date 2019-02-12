<template>
	<div class="msg" >
		<el-row type="flex" class="row-bg" justify="space-between" style="max-width: 1300px;">
			<el-col :span="1">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col class="select_select" :span="8">
				<div class="grid-content bg-purple">
					<p class="title">
						<b class="icon_num">1</b>
						<span class="icon_text">筛选 / 上传用户</span>
					</p>
					<!--系统筛选用户-->
					<el-card class="box-card ">
						<p class="title_min">系统内筛选用户</p>
						<el-form :model="fromMode" class="demo-ruleForm" label-width="85px">
							<el-form-item label="选择项目">
								<el-select v-model="fromMode.project_id" placeholder="全部项目" @change="projectChange" clearable>
									<el-option v-for="item in project_item" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择产品">
								<el-select v-model="fromMode.product_id" placeholder="全部产品" @change="productChange" clearable>
									<el-option v-for="item in product_item" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择性别">
								<el-select v-model="fromMode.gender" placeholder="不限" clearable>
									<el-option label="男" value="1"></el-option>
									<el-option label="女" value="2"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="所在省份">
								<el-select v-model="fromMode.province" placeholder="不限" clearable>
									<el-option v-for="item in province" :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="出生年份">
								<el-date-picker v-model="fromMode.s_birthday" type="year" placeholder="开始" :picker-options="pickerOptions0" @change='pic1' style="width:90px;">
								</el-date-picker>
								至
								<el-date-picker v-model="fromMode.e_birthday" type="year" placeholder="结束" :picker-options="pickerOptions1" @change='pic2' style="width:90px;">
								</el-date-picker>
							</el-form-item>
							<div class="form_btn">
								<el-button type="success" @click="selectUser" class="success_btn">确认</el-button>
							</div>
						</el-form>
					</el-card>
					<!--上传 导入用户-->
					<el-card class='box-card uploadBox margin'>
						<p class="title_min">文件上传用户</p>
						<el-upload ref="upload" 
							class="uploadContent" 
							action="" 
							:auto-upload="false" 
							accept=".xls, .xlsx, .csv" 
							:file-list="fileList" 
							:on-change="fileChange">
							<el-button slot="trigger" icon="el-icon-upload" type="primary">
								选择文件
							</el-button>
						</el-upload>
						<el-button v-if='btnSubmitUpload' @click="submitUpload" class="success_btn" type="success">
							导入手机号
						</el-button>
					</el-card>
					<el-card class='box-card uploadBox margin' style="text-align: left;">
						<p class="title_min">单独添加用户</p>
						<el-input
						  placeholder="请输入手机号"
						  v-model="phone"
						  clearable style="display: inline-block;width: 70%;">
						</el-input>
						<el-button @click="addPhone" class="success_btn" type="success" style="display: inline-block;width: 20%;">
							添加
						</el-button>
					</el-card>
				</div>
			</el-col>
			<el-col :span="1">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col class="confirm_user" :span="8">
				<div class="grid-content bg-purple-light">
					<p class="title">
						<b class="icon_num">2</b>
						<span class="icon_text">发送短信</span>
					</p>
					<p style="font-size: 12px;margin: 12px 0;"><span style="font-size: 16px;">手机号数量：{{phoneArr.length}} </span>(已自动排除重复、格式不正确手机号码)</p>
					<el-card class="box-card uploadBox margin">
						<p class="title_min">发送营销短信</p>
						<el-button class="repeat_btn" @click="setRepeat" type="primary">
							下载号码包
						</el-button>
						<p class="downloadTip" style='text-align: left;font-size: 12px;'>下载号码包后，请直接上传至《企业短信开放平台》，进行发送操作；<br/>
							如需编辑，请参考《营销短信数据包文档》，使用“Notepad++”进行编辑。</p>
					</el-card>
					<el-card class="box-card margin">
						<p class="title_min">发送通知短信</p>
						<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 8}" placeholder="请输入短信内容" v-model="msgText">
						</el-input>
						<p class="msg_tip" >共计{{msgText.length}}字符，需要短信条数：{{Math.ceil(msgText.length/70)}} 
						</p>
						<el-form class="post_test" style='display: inline-block;width: 65%;'>
							<el-form-item label="测试手机号" label-width="35%">
								<el-input type="text" v-model="testPhone" placeholder="测试手机号" clearable></el-input>
							</el-form-item>
						</el-form>
						<span @click="postTestMsg" :class="setIntervalTime? 'testBtn' : 'testBtn desc'" :disabled="!setIntervalTime">
							{{setIntervalTime ? '发送测试短信' : time+'后再发送'}}
						</span>
						<div class="post_btn">
							<el-button @click="postMsg" :type="btnType" :disabled='show'>
								确认发送
							</el-button>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="1">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
		<div v-if='loading' class="loadingPage">
			<div class="loadingT">
				<i class="icon el-icon-loading"></i><br/>
				<span>Loading</span>
			</div>
		</div>
	</div>
</template>

<script>
	import datePicker from "../public/datePicker";
	export default {
		components: {
			datePicker
		},
		data() {
			return {
				btnSubmitUpload: false,
				setIntervalTime: true,
				time: 60,
				pickerOptions0: {
					disabledDate: (birthday) => {
						if(this.fromMode.e_birthday == "") {
							return birthday.getTime() > Date.now();
						} else if(this.fromMode.e_birthday == null) {
							return birthday.getTime() > Date.now();
						} else {
							return birthday.getTime() >= Date.now() || birthday.getTime() > this.fromMode.e_birthday;
						}
					}
				},
				pickerOptions1: {
					disabledDate: (birthday) => {
						return birthday.getTime() < this.fromMode.s_birthday || birthday.getTime() >= Date.now();
					}
				},
				province: ["北京市", "天津市", "上海市", "重庆市", "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省", "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区", "台湾地区", "香港特别行政区", "澳门特别行政区"],
				//筛选用户查询参数
				fromMode: {
					project_id: '',
					product_id: '',
					gender: '',
					province: '',
					s_birthday: '',
					e_birthday: ''
				},
				project_item: [],
				product_item: [],
				product_category: '',
				birthday: '',
				phone:'',
				msgText:'',
				testPhone:'',
				phoneArr:[],
				fileList: [],
				loading:false,
				show:true,
				btnType:'info',
				phoneReg:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
			}
		},
		created: function() {
			this.getproject();
		},
		methods: {
			/*系统筛选相关方法==========================*/
			pic1(value) {
				value == null ? this.fromMode.s_birthday = '' : this.fromMode.s_birthday = value
			},
			pic2(value) {
				value == null ? this.fromMode.e_birthday = '' : this.fromMode.e_birthday = value
			},
			selectUser() { //用户筛选 参数 fromMode
				var self = this;
				//self.loading=true;
				if(self.fromMode.project_id == '') {
					self.$message.error('请选择项目进行用户筛选！');
					return;
				}
				self.loading = true;
				self.post('api/Sendmessage/getSendMessagePhone', self.fromMode,
					function(data) {
						if(data.data.code == 200) {
							var phone_ = data.data.data;
							self.phoneArr.concat(phone_);
							self.repeat();
						} else {
							self.$message.error(data.data.msg);
						}
						self.loading = false;
					},
					function(error) {});
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
							self.fromMode.product_id = '';
						} else {
							self.$message.error(data.data.msg);
						}
					},
					function(error) {});
			},
			productChange(value) {
				this.fromMode.product_id = value;
			/*系统筛选相关方法结束======================================================*/
			},
			fileChange() {/*上传导入用户相关==========================================================*/
				var file = document.querySelector('input[type=file]');
        		file.value = '';
				if(this.$refs.upload.uploadFiles.length > 1) {
					this.$refs.upload.uploadFiles.splice(0, 1);
				}
				this.btnSubmitUpload = true;
			},
			submitUpload() {
				var self = this;
				let list = document.getElementsByClassName('el-upload-list__item is-ready')
				if(list.length == 0) {
					this.$message({
						type: 'warning',
						message: "请选择需要导入的文件！"
					})
					return;
				};
				self.loading = true;
				/*导入*/
				var wb; //读取完成的数据
				var rABS = false; //是否将文件读取为二进制字符串
				var isCSV;
				var f = self.$refs.upload.uploadFiles[0].raw;
				var f_type = f.name.substring(f.name.length - 3, f.name.length) //文件后缀格式
				var fileReader = new FileReader();
				fileReader.onload = (e) => {
					var data = e.target.result;
					wb = null;
					if(isCSV) {
						data = rABS ? new Uint8Array(data) : data;
						var str = cptable.utils.decode(936, data);
						wb = self.$xlsx.read(str, {
							type: "string"
						});
					}
					if(!wb) {
						wb = rABS ? self.$xlsx.read(btoa(self.fixdata(data)), {
							type: 'base64'
						}) : self.$xlsx.read(data, {
							type: 'binary'
						});
					}
					//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
					//wb.Sheets[Sheet名]获取第一个Sheet的数据
					//self.$xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
					var arr = self.$xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
					for(var i=0;i<arr.length;i++){
						self.phoneArr.push(arr[i]['手机号']);
					}
					self.repeat();
					self.$refs.upload.uploadFiles=[];
					setTimeout(function(){
						self.loading = false;
					},300);
				};
				isCSV = f_type == "csv"; //判断是否是 CSV
				if(rABS) {
					fileReader.readAsArrayBuffer(f);
				} else {
					fileReader.readAsBinaryString(f);
				}
			},
			fixdata(data) { //文件流转BinaryString
				var o = "",
					l = 0,
					w = 10240;
				for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
				o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
				return o;
			},
			addPhone(){
				var arr = this.phoneArr;
				var phone = this.phone;
				if(!this.phoneReg.test(phone)){
					this.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '请输入正确手机号！'
			        });
					return;
				};
				if(arr.indexOf(phone) > -1){
					this.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '手机号已存在！'
			        });
			        return;
				}
				arr.push(phone);
				this.$notify.success({
			            title: '提示',
			            duration:2000,
			            message: '添加成功！'
			        });
			        return;
				this.phone='';
			},
			setRepeat() {/*上传导入用户相关结束========================================================*/
				var self = this;
				if(self.phoneArr.length==0){
					self.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '手机号格式错误，请重新填写要下载的手机号！'
			        });
			       return;
				}else{
					self.loading = true;
					var arrOldPhone = self.phoneArr;
					var phoneTxt='';
					for(var i = 0; i < arrOldPhone.length; i++) {
						phoneTxt+=arrOldPhone[i]+'\r\n';
					}
					self.exportRaw('手机号.txt', phoneTxt);
					setTimeout(function(){
						self.loading = false;
					},300);
				}
			},
			fakeClick(obj) {
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				obj.dispatchEvent(ev);
			},
			exportRaw(name, data) {
				var urlObject = window.URL || window.webkitURL || window;
				var export_blob = new Blob([data],{type:"text/bath;charset=utf-8"});
				var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
				save_link.href = urlObject.createObjectURL(export_blob);
				save_link.download = name;
				this.fakeClick(save_link);
			},
			repeat(){
				var arrPhone = [];
				var arrOldPhone = this.phoneArr;
				for(var i = 0; i < arrOldPhone.length; i++) {
					if(arrPhone.indexOf(arrOldPhone[i]) == -1&&arrOldPhone[i] != ''&&this.phoneReg.test(arrOldPhone[i])) {
						arrPhone.push(arrOldPhone[i]);
					}
				}
				this.phoneArr = arrPhone;
			},
			postTestMsg(){
				if(this.setIntervalTime==false){
					return false;
				};
				var phone = this.testPhone;
				var msg = this.msgText.replace(/\n/g,'');
				if(msg==''){
					this.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '请输入短信内容！'
			        });
					return;
				};
				if(this.phoneReg.test(phone)){
					var self = this;
					/*倒计时*/
					self.setIntervalTime=false;
					self.time_();
					self.post('api/Sendmessage/sendTestSms',{phone:phone,message:msg},
			  		function(data){
			  			if(data.data.code==200){
			  				self.show=false;
							self.btnType='success';
							self.$message({
					          message: '发送成功！',
					          type: 'success'
					        });
					        
			  			}else{
			  				self.$message.error(data.data.msg);
			  			}
			  		},function(error){
			  		});
				}else{
					this.$notify.warning({
			            title: '提示',
			            duration:3500,
			            message: '请输入正确手机号！'
			        });
					return;
				}
			},
			time_(){
				var self = this;
				var insetId = setInterval(function (){
					if(self.time>0){
						self.time--;
					}else{
						self.setIntervalTime = true;
						self.timeTypeBtn = 'primary';
						self.time=60;
						self.testPhone='';
						clearInterval(insetId);
					}
				},1000)
			},
			postMsg(){
				this.loading = true;
				var phone = this.phoneArr.join(",");
				var msg = this.msgText.replace(/\n/g,'');
				var self = this;
				self.post('api/Sendmessage/getSendMessage',{phone:phone,message:msg},
		  		function(data){
		  			if(data.data.code==200){
		  				self.loading=false;
		  				self.phoneArr=[];
		  				self.$message({
					        message: '发送成功！',
					        type: 'success'
					    });
		  			}else{
		  				self.$message.error(data.data.msg);
		  			}
		  		},function(error){
		  		});
			}
		}
	}
</script>

<style scoped>
	/*.msg .el-form-item {margin-bottom: 0;}*/
	.loadingPage{
		width: 100%;
		height: 100%;
		position: absolute;
	    z-index: 1000;
	    background-color: rgba(255,255,255,.9);
	    margin: 0;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    -webkit-transition: opacity .3s;
	    transition: opacity .3s;
	}
	.icon{font-size: 40px;margin-bottom: 10px;}
	.loadingT{
		position: absolute;
		left: 50%;top: 50%;
		transform: translate(-50%, -50%);
		font-size: 20px;color: #1b96d5;
		text-align: center;
	}
	.msg .title {
		text-align: center;
		padding: 15px 0;
	}
	.icon_num {
		display: inline-block;
		width: 34px;
		height: 34px;
		line-height: 34px;
		background: #1b96d5;
		border-radius: 50%;
		font-size: 30px;
		color: #fff;
		text-align: center;
		margin-right: 7px;
	}
	.icon_text {
		display: inline-block;
		font-size: 22px;
		color: #1b96d5;
		height: 34px;
		line-height: 34px;
		vertical-align: top;
	}
	.select_select,.confirm_user {
		min-width: 300px;
	}
	.title_min {
		font-size: 18px;
		text-align: left;
		padding-bottom: 15px;
		font-weight: 600;
	}
	.uploadBox {
		text-align: center;
	}
	.margin{
		margin-top: 10px;
	}
	.uploadContent {
		min-height: 100px;
	}
	.repeat_btn {
		margin: 20px 0 30px;
	}
	.success_btn {
		display: inherit;
		width: 140px;
		margin: 10px auto;
	}
	.msg_tip {
		margin: 10px 0;
		line-height: 20px;
		font-size: 14px;
		color: #a3a3a3;
	}
	.post_test {
		margin: 0;
	}
	.post_btn {
		text-align: center;
		margin: 0 0 15px;
	}
	.form_btn {
		text-align: center;
	}
	.testBtn{
		font-size:12px;
		display: inline-block;
		width: 25%;
		text-align:center;
		padding: 7px 5px;
		cursor: pointer;
		color: #fff;
		background: #1b96d5;
		border-radius: 5px;
	}
	.testBtn.desc{
		cursor:default;
		background: #c8c9cc;
	}
	/deep/.el-form-item {
		margin-bottom: 15px;
	}
	.row-bg {
		padding: 0 30px
	}
</style>