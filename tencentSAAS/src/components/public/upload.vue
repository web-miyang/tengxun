<template>
	<div class="uploat_btn">
		<el-button @click="dialogVisible = true" type="primary" plain size="mini">{{btn_text}}</el-button>
		<el-dialog title="文件上传" class="upload" :visible.sync="dialogVisible" @close="dialogFn" :modal-append-to-body="false">
			<el-upload v-show="!down"
				style="display:inline-block" 
				class="upload-demo" 
				ref="upload" 
				accept=".xls" 
				action="" 
				:file-list="fileList" 
				:http-request="uploadSectionFile" 
				:on-change="fileChange" 
				:auto-upload="false">
				<el-button slot="trigger" type="primary" plain>选取文件</el-button>
			</el-upload>
			<div >
				<div class="block" v-if="list_.length>0">
					<el-table :data="showList_">
					    <el-table-column property="line" label="行数" width="150" align="center"></el-table-column>
					    <el-table-column property="message" label="错误信息" align="center"></el-table-column>
					</el-table>
				    <el-pagination
				    	class="pageList"
				    	@current-change="handleCurrentChange" 
				    	:current-page="page.index" 
				    	:page-size="page.size" 
				    	:pager-count='5' 
				    	layout="total, prev, pager, next" 
				    	:total="page.count">
				    </el-pagination>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
			<el-button v-if="!down" type="primary" @click="submitUpload">上传</el-button>
			<el-button v-if="down" type="primary" @click="downError">下载信息</el-button>
		    <el-button @click="dialogFn">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import { Loading } from 'element-ui';
	export default {
		data() {
			return {
        upbtn:true,
				dialogVisible: false,
				fileList: [],
				showList_:[],
				list_:[],
				//分页变量
		        page: {
					index: 1,
					size: 10,
					count: 0
				},
				down:false
			}
		},
		props: ['btn_text', 'id', 'upload_url'],
		methods: {
			fixdata(data) { //文件流转BinaryString
				var o = "",
					l = 0,
					w = 10240;
				for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
				o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
				return o;
			},
			dialogFn() {
				this.fileList = [];
				this.list_=[];
				this.showList_=[];
				this.page.index = 1;
				this.dialogVisible = false;
				this.down=false;
			},
			submitUpload() {
				let list = document.getElementsByClassName('el-upload-list__item is-ready')
				if(list.length == 0) {
					this.$message({
						type: 'warning',
						message: "请选择需要导入的模板！"
					})
					return;
				}
				this.$refs.upload.submit();
			},
			fileChange(){
				if(this.$refs.upload.uploadFiles.length>1){
					this.$refs.upload.uploadFiles.splice(0,1);
				}
			},
			downError(){
				var self = this;
				var data = self.list_;
				if(data.length!=0){
					var data_ = [];
					for(var i in data){
						var json_={};
						json_['行数'] = data[i].line;
						json_['错误信息'] = data[i].message;
						data_.push(json_);
					}
					var ws = self.$xlsx.utils.json_to_sheet(data_);/* 新建空workbook，然后加入worksheet */
					var wb = self.$xlsx.utils.book_new();/*新建book*/
					self.$xlsx.utils.book_append_sheet(wb, ws, "error");/* 生成xlsx文件(book,sheet数据,sheet命名)*/
					self.$xlsx.writeFile(wb, "错误信息.xlsx");/*写文件(book,xlsx文件名称)*/
				}
			},
			uploadSectionFile() {
				var self = this;
				var loading = self.$loading({
			        lock: true,
			        text: '正在导入文件',
			        customClass:'loadClass',
			        spinner: 'el-icon-loading',
			        background: 'rgba(255, 255, 255, 0.7)'
		        });
				let form = this.$refs.upload.uploadFiles[0];
				let formData = new FormData();
				formData.append('name', form.name);
				formData.append('product_id', this.id);
				formData.append('file', form.raw);
				let token = this.$datacenter.getData("token");
				if(token != undefined) {
					formData.append('token', token)
				}
				this.$axios.post(this.Link + this.upload_url, formData).then(res => {
					self.fileList = [];
					loading.close();
					if(res.data.code == 200) {
						self.$message.success(res.data.msg);
						self.dialogFn();
						self.dialogVisible=false;
					} else if(res.data.code == 201008) {//文件格式错误
						self.$message.error(res.data.msg);
					} else if(res.data.code == 201009) {//文件错误信息
						self.list_ = res.data.msg;
						self.page.count = res.data.msg.length;
						self.handleCurrentChange(1);
						self.down=true;
						//self.$message.error(res.data.msg)
					} else {
						self.$message.error(res.data.msg)
					}
				})
			},
			handleCurrentChange(val) {
				this.page.index = val
				this.showList_ = this.list_.slice((val-1)*this.page.size,this.page.size*val);
			}
		}
	}
</script>

<style scoped>
	.el-table .el-table__fixed::before {
		content: '';
		position: relative;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0;
		background-color: rgba(0, 0, 0, 0);
		z-index: -1!important;
	}
	.upload .el-dialog__body{
		min-height: 135px!important;
	}
	.upload .el-dialog__body{
		padding:30px 20px 0;
	}
	.pageList{padding: 10px 0;}
	.el-dialog{min-width: 500px;}
</style>
