<template>
	<div class="address">
		<el-select v-model="m_province" placeholder="请选择省" @change='provinceChange' style='width:140px' clearable>
		    <el-option
		      v-for="item in inoProvince"
		      :key="item.id"
		      :label="item.title"
		      :value="item.id">
		    </el-option>
		</el-select>
		<el-select v-model="m_city" placeholder="请选择市" @change='cityChange' style='width:140px' clearable>
		    <el-option
		      v-for="item in inoCity"
		      :key="item.id"
		      :label="item.title"
		      :value="item.id">
		    </el-option>
		</el-select>
		<el-select v-model="m_area" placeholder="请选择区" @change='areaChange' style='width:140px' clearable>
		    <el-option
		      v-for="item in inoDistrict"
		      :key="item.id"
		      :label="item.title"
		      :value="item.id">
		    </el-option>
		</el-select>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				inoProvince:'',
				inoCity: '',
			    inoDistrict: '',
			    m_province:'',
			    m_city:'',
			    m_area:'',
				data:{
				   	province:'',
				    city:'',
				    area:''
				}
			}
		},
		props:['province','city','area'],
		created(){
			this.inoProvince = this.$province;
			if(this.province!=''){
				this.provinceChange(this.province.id);
				this.cityChange(this.city.id);
				this.m_province = this.province.id;
				this.m_city = this.city.id;
				this.m_area = this.area.id;
			}
		},
		methods:{
			provinceChange(value){
			    for(var a in this.$city){
			   	    if(a = value){
			   	 		this.inoCity = this.$city[a]
			   	    }
			    }
			    this.m_city='';
			    this.m_area='';
			},
			cityChange(value){
				for(var a in this.$area){
			   	    if(a = value){
			   	 		this.inoDistrict = this.$area[a]
			   	    }
			   }
				this.m_area='';
			},
			areaChange(value){
			    this.data.province = this.inoProvince.find((item)=>{
			        return item.id === this.m_province;
			    });
			    this.data.city = this.inoCity.find((item)=>{
			        return item.id === this.m_city;
			    });
			    this.data.area = this.inoDistrict.find((item)=>{
			        return item.id === value;
			    });
			    this.$emit('areaChange',this.data);
			}
		}
	}
</script>

<style>
</style>