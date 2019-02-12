<template>
	<div class="tabTag">
		<el-tag
		  :key="tag"
		  v-for="tag in dynamicTags"
		  closable
		  :disable-transitions="false"
		  @close="handleClose(tag)"
		  size="small">
		  {{tag}}
		</el-tag>
		<div class="">
			<el-input
			  class="input-new-tag"
			  v-model="inputValue"
			  ref="saveTagInput"
			  size="small"
			  placeholder="请输入"
			>
			</el-input>
			<el-button :class='info' class="button-new-tag" @click="handleInputConfirm" type='default' icon="el-icon-plus">
				添加
			</el-button>
		</div>
	</div>
</template>
<script >
  export default {
    data() {
      return {
        dynamicTags: [],
        inputValue: '',
        placeholder:'',
        info:''
      };
    },
    created:function(){
    	this.dynamicTags=this.data;
    },
    props:['data'],
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        let dynamicTags = this.dynamicTags;
        for(var val in dynamicTags){
        	if(dynamicTags[val]==inputValue){
        		this.$message.error('输入重复');
        		return;
        	}
        }
        if (inputValue) {
          dynamicTags.push(inputValue);
        }
        this.inputValue = '';
        this.info='info';
      }
    }
  }
</script>
<style scoped>
  .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .button-new-tag:hover{
  	color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .input-new-tag {
    width: 100px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .info{
  	background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
</style>