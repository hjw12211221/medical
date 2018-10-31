<template lang="jade">
#patient
	.bg-fixed
	.header
		.left(onclick="window.history.go(-1)")
			.font.dark &#xe61f;
		.title
			| 体检人
		.right(@click='addPatient')
			| 添加
	.main(style='bottom:0')
		router-link.block.bg-white.py3.border-bottom(v-for='(x,index) in list' ,:key="index",:to="'/patientInfo/'+x.patId")
			.mx3.mb2.f3 {{x.patientName}} 
				span.f4.ml2.gray {{x.patientSex==='1'?'男':'女'}}
			.mx3.gray 身份证: {{x.patientCardNo}}

</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
export default {
	components: {
	},
	data () {
		return {
			list:[],
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('体检人')
			bookApi('ddyy.medical.pat.list.v2',{
				bookPatId:util.getVal('userInfo').patientId
			}).then((res) => {
				if(res.data.code==0){
						this.list=res.data.obj.list
					}else {
						console.log('error',res.data.msg)
					}
			})
			
		},
		addPatient:function(){
			this.$router.push({path:'/addPatient'})
		},
		
	},
	watch: {


	}
}
</script>