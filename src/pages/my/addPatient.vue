<template lang="jade">
#addPatient
	.bg-fixed
	.my4
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 姓名
		input.flex-max.w10.f4(placeholder='请输入姓名'  v-model='patientName')
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 身份证号
		input.flex-max.w10.f4(placeholder='请输入证件号码'  v-model='patientCardNo')
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 手机号
		input.flex-max.w10.f4(placeholder='请输入手机号码'  v-model='patientMobile')
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 性别
		.mr3.text-center
			span.font.gray.mx3(v-if="patientSex==''||patientSex==2" @click='patientSex=1') &#xe67f;
			span.font.mx3.primary(v-if='patientSex==1') &#xe61e;
			| 男
		.mr3.text-center
			span.font.gray.mx3(v-if="patientSex==''||patientSex==1" @click='patientSex=2') &#xe67f; 
			span.font.mx3.primary(v-if='patientSex==2') &#xe61e;
			| 女
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 婚姻状况
		.mr3.text-center
			span.font.mx3.gray(v-if="maritalStatus===''||maritalStatus==1" @click='maritalStatus=0') &#xe67f; 
			span.font.mx3.primary(v-if='maritalStatus===0') &#xe61e;
			| 未婚
		.mr3.text-center
			span.font.mx3.gray(v-if="maritalStatus===''||maritalStatus===0" @click='maritalStatus=1') &#xe67f; 
			span.font.mx3.primary(v-if='maritalStatus==1') &#xe61e;
			| 已婚
	.btn-block(style='margin-top:40px' @click='add') 确认添加
	modal-hint(:isShow='hintIsModal',:content='hint')
</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalHint from '../../component/modalHint.vue'

export default {
	components: {
    modalHint

	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			patientCardNo:'',
			patientName:'',
			patientMobile:'',
			patientSex:'',
			maritalStatus:'',
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('添加体检人')
		},
		add:function () {			
			// console.log(this.patientName,this.patientCardNo.length,this.patientMobile.length,this.patientSex,this.maritalStatus)
			
			if(this.patientName!=''&&
				this.patientCardNo.length==18&&
				this.patientMobile.length==11
				){
				bookApi('ddyy.medical.pat.add',{
					patientCardNo:this.patientCardNo,
					patientName:this.patientName,
					patientMobile:this.patientMobile,
					patientSex:this.patientSex,
					maritalStatus:this.maritalStatus,
					bookPatId:util.getVal('userInfo').patientId
				}).then((res) => {
					if(res.data.code == 0){
						if(util.getVal('addPatient')&&util.getVal('addPatient')!=null){
							window.location.href=util.getVal('addPatient')
							util.removeVal("addPatient");
						}else{
							this.$router.push({path:'/patient'})
						}
					}else {
						util.hintIsModal(res.data.msg,this)
					}
				})
			}else if(this.patientName==''){
				util.hintIsModal('姓名不可为空',this)
			}else if(this.patientCardNo==''){
				util.hintIsModal('身份证不可为空',this)
			}else if(this.patientCardNo.length!=18){
				util.hintIsModal('身份证格式错误',this)
			}else if(this.patientMobile==''){
				util.hintIsModal('手机号不可为空',this)
			}else if(this.patientMobile.length!=11){
				util.hintIsModal('手机号格式错误',this)
			}else{
				util.hintIsModal('未知错误',this)
			}

		}
		
	},
	watch: {
		// patientCardNo:function(val){
		// 	console.log(val.length)
		// }
	}
}
</script>
<style lang='stylus' scoped>
	span.font.gray.mx3
		display inline-block
		width 15px
</style>