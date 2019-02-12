<template>
	<div id="userImport" class="userImport" v-loading="loading">
		<!--列表-->
		<el-table :data="tableData" border>
			<el-table-column prop="create_time" width="180" label="发送时间" align="center">
			</el-table-column>
			<el-table-column prop="name" width="150" label="操作人" align="center">
			</el-table-column>
			<el-table-column label="短信内容" align="center">
				<template slot-scope="scope">
					<el-popover
					    placement="top-start"
					    title=""
					    width="300"
					    trigger="hover">
					    <p>{{scope.row.content}}</p>
					    <div style="text-align: right; margin: 0">
						    <el-button @click="copyActiveCode($event,scope.row.content)" type="primary" size="mini">复制</el-button>
						</div>
					    <el-button slot="reference">查看</el-button>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="count" label="发送人数" align="center">
			</el-table-column>
			<el-table-column prop="send_count" label="已发送人数" align="center">
			</el-table-column>
			<el-table-column label="失败记录" width="150" align="center">
				<template slot-scope="scope">
				    <el-button v-if='scope.row.error_count!=0' @click="downMsg(scope.row)" type="text">下载<br/>（共{{scope.row.error_count}}条）</el-button>
				    <span v-if='scope.row.error_count==0'>无</span>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<div class="pageList">
			<el-pagination @current-change="handleCurrentChange" :current-page="page.index" :page-size="page.size" :pager-count='7' layout="total, prev, pager, next, jumper" :total="page.count">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard';
	export default {
		data() {
			return {
				loading:true,
				formInline: {
					page:1
				},
				tableData: [/*{
						create_time: '2016-05-02',
						name: '王小虎1',
						content: '备注上海市普陀区金沙江路 1518 弄',
						count: '333',
						send_count: "123"
					}*/],
				page: {
					index: 1,
					size: 10,
					count: 0
				}
			}
		},
		created: function() {
			this.getList();
		},
		methods: {
			//分页
			handleCurrentChange(val) {
				this.page.index = val
				this.getList();
			},
			//请求列表数据
			getList(){
				var self = this;
				self.loading=true;
				self.formInline.page=this.page.index;
				self.post('api/Sendmessage/sendMessageInfo',self.formInline,
		  		function(data){
		  			if(data.data.code==200){
		  				self.tableData = data.data.data.data;
		  				self.page.count = data.data.data.count;
		  				self.loading=false;
		  			}else{
		  				self.$message.error(data.data.data.msg);
		  			}
		  		},function(error){
		  		});
			},
			downMsg(data){
				var self = this;
				self.post('api/Sendmessage/getErrorMessageSms',{id:data.id},
			  	function(data){
			  		if(data.data.code==200){
			  			self.downText(data.data.data);
			  		}else{
			  			self.$message.error(data.data.msg);
			  		}
			  	},function(error){
			  	});
			},
			downText(phoneArr) {/*导入失败记录========================================================*/
				var self = this;
				self.loading = true;
				var phoneTxt='';
				for(var i = 0; i < phoneArr.length; i++) {
					phoneTxt+=phoneArr[i]+'\r\n';
				}
				self.exportRaw('短信发送失败手机号.txt', phoneTxt);
				setTimeout(function(){
					self.loading = false;
				},300);
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
			copyActiveCode(e, text) {
				var self = this;
			    const clipboard = new Clipboard(e.target, { text: () => text })
			    clipboard.on('success', e => {
				    self.$message({ type: 'success', message: '复制成功' })
				    // 释放内存
				    clipboard.off('error')
				    clipboard.off('success')
				    clipboard.destroy()
				})
			    clipboard.on('error', e => {
				    // 不支持复制
				    self.$message({ type: 'waning', message: '该浏览器不支持自动复制' })
				    // 释放内存
				    clipboard.off('error')
				    clipboard.off('success')
				    clipboard.destroy()
				})
			    clipboard.onClick(e)
			}  
		}
	}
</script>

<style scoped>
	/deep/#userImport .el-table td, /deep/#userImport .el-table th{
		padding: 15px 0;
	}
	.pageList {
		text-align: center;
		padding-top: 20px;
	}
</style>