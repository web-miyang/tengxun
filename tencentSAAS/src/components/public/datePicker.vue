<template>
	<el-date-picker 
		v-model="models_"
		:type="type_"
		unlink-panels
		range-separator="至"
		:start-placeholder="placeholder_+placeholder1"
		:end-placeholder="placeholder_+placeholder2"
		@change='timeChangeFn'
		:size='size_'
		:value-format="format_"
		:picker-options="picker_==true ? pickerOptions2 : pickerOptions1"
		>
	</el-date-picker>
</template>

<script>
	export default {
		data() {
			return {
				type_: 'daterange',/*datetimerange 精确到秒   daterange 精确到天*/
				format_:'yyyy-MM-dd',/*yyyy-MM-dd HH:mm:ss*/
				models_: '',//默认显示数据
				size_: 'large',//文本框大小 large, small, mini
				picker_: false,/*是否显示快捷选项 最近一周 一个月 三个月*/
				placeholder_:'',
				placeholder1:'开始时间',
				placeholder2:'结束时间',
				pickerOptions1: '',
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				}
			}
		},
		props:['models','type','format','size','picker','placeholder'],
		created: function(){
			if(this.models!=undefined){this.models_=this.models}; 
			if(this.type!=undefined){this.type_=this.type}; 
			if(this.format!=undefined){this.format_=this.format};
			if(this.size!=undefined){this.size_=this.size};
			if(this.picker!=undefined){this.picker_=this.picker};
			if(this.placeholder!=undefined){this.placeholder_=this.placeholder}; 
		},
		methods:{
			timeChangeFn(value){
				this.$emit('timeChange',value)
			}
		}

	}
</script>

<style>

</style>