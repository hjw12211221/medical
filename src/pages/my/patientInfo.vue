<template lang="jade">
#patientInfo
	.bg-fixed
	.my4
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 姓名
		input.flex-max.f4.mx3.text-right(v-model='infoObj.patientName') 
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 身份证号
		.flex-max.f4.mx3.text-right {{infoObj.patientCardNo}}
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 手机号
		input.flex-max.f4.mx3.text-right(v-model='infoObj.patientMobile' v-show="!infoObj.bookPatId")
		.flex-max.f4.mx3.text-right( v-show="infoObj.bookPatId") {{infoObj.patientMobile}}
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 性别
		.mr3.text-center
			span.font.gray.mx3(v-if="infoObj.patientSex==''||infoObj.patientSex==2" @click='infoObj.patientSex=1') &#xe67f;
			span.font.mx3.primary(v-if='infoObj.patientSex==1') &#xe61e;
			| 男
		.mr3.text-center
			span.font.mx3.gray(v-if="infoObj.patientSex==''||infoObj.patientSex==1" @click='infoObj.patientSex=2') &#xe67f; 
			span.font.mx3.primary(v-if='infoObj.patientSex==2') &#xe61e;
			| 女
	.flex.pl3.py2.border-bottom.bg-white
		.dark(style='width:70px') 婚姻状况
		.mr3.text-center
			span.font.mx3.gray(v-if="infoObj.maritalStatus===''||infoObj.maritalStatus=='1'" @click="infoObj.maritalStatus='0'") &#xe67f; 
			span.font.mx3.primary(v-if="infoObj.maritalStatus==='0'") &#xe61e;
			| 未婚
		.mr3.text-center
			span.font.mx3.gray(v-if="infoObj.maritalStatus===''||infoObj.maritalStatus==='0'" @click="infoObj.maritalStatus='1'") &#xe67f; 
			span.font.mx3.primary(v-if="infoObj.maritalStatus=='1'") &#xe61e;
			| 已婚
	.btn-block(style='margin-top:40px' @click='save') 保存
	.btn-block(v-show="!infoObj.bookPatId" style='margin-top:20px;background:#fff;color:gray;' @click='isMask=true') 删除
	.modalText.mask(v-if='isMask==true')
		.contentText.bg-white
			.modal-title.py4.f2 提示
			.modal-content.py1.f3.mb4 确认取消订单
			.modal-footer.flex.justify-around()
				.btn.w5(style='height:40px;line-height:40px;color:#aaa;background-color:#eee;  border-radius:0' @click='isMask=false') 取消
				.btn.w5.primary(style='height:40px;line-height:40px;border-radius:0' @click='remove') 确认
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
			infoObj:'',
			isMask:false,
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function ()  {
			util.setTitle('体检人信息')
			bookApi('ddyy.medical.pat.info',{
				patId:this.$route.params.patId
			}).then((res) => {
				if(res.data.code==0){
					this.infoObj=res.data.obj
				}else {
					util.hintIsModal(res.data.msg,this)
				}
			})
		},
		remove:function(){
			bookApi('ddyy.medical.pat.delete',{
				patId:this.$route.params.patId,
				bookPatId:util.getVal('userInfo').patientId
			}).then((res) => {
				if(res.data.code==0){
					console.log('成功')
					this.$router.push({path:'/patient'})
				}else{
					util.hintIsModal(res.data.msg,this)
				}
			})

		},
		save:function(){
			bookApi('ddyy.medical.pat.update',{
				patId:this.$route.params.patId,
				bookPatId:util.getVal('userInfo').patientId,
				patientCardNo:this.infoObj.patientCardNo,
				patientName:this.infoObj.patientName,
				patientMobile:this.infoObj.patientMobile,
				patientSex:this.infoObj.patientSex,
				maritalStatus:this.infoObj.maritalStatus
			}).then((res) => {
				if(res.data.code==0){
					this.$router.push({path:'/patient'})

				}else{
					util.hintIsModal(res.data.msg,this)
				}
			})
		},
	},
	watch: {


	}
}
</script>