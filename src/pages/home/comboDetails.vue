<template lang="jade">
#comboDetails
	.main(style='top:0;bottom:50px;')
		.iconCalback(@click="iconClickChange" v-if="channel!='yhwy'")
			img(src="../../images/home_icon.png")
			router-link.flex-max.relative(to='/home' v-if="iconCalback") 首页
			router-link.flex-max.relative(to='/orgHome' v-if="iconCalback") 机构
			router-link.flex-max.relative(to='/comboHome' v-if="iconCalback") 套餐		
		.p3.bottom_bg.mb2
			.f4(style="fontWeight:bold;") {{comboObj.comboName}}
			.flex.align-center
				.flex-max.f4.red.my2 
					span.mr2 {{comboObj.preferentPrice}}元 
					span {{comboObj.discount | discount}}
					span.ml4.f5.gray 原价 {{comboObj.realPrice}}元
				.gray 预约量{{comboObj.comboOrderCount+comboObj.realOrderCount}}
			router-link.f4.dark.text-decoration(:to="'/orgDetails/'+comboObj.orgId") 体检机构: {{comboObj.orgName}}
			.dark.omit.font.my2 &#xe669; 
				span.f4 {{comboObj.address}}
			.flex.align-center.border-top
				.flex-max.pt2.dark.f4.omit 适宜人群: {{comboObj.applyCrowd || '暂无介绍'}}
				.font.mx3.pt2(@click='explain(comboObj)') &#xe698;
		.flex.text-center.border-bottom
			.w34
				span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index==0}" @click='index=0') 套餐体检
			.w34
				span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index===1}"  @click='index=1') 体检流程
			.w34
				span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index===2}"  @click='index=2') 体检须知
		.bottom_bg.mb2(v-if='index===0')
			div(v-for='(item,index) in itemList')
				.flex.align-center.border-bottom(v-for='x in item.itemList')
					.w4.text-left.indent20.py2.omit.darker(style='background-color:#FFF2E7') {{x.itemDesc}}
					.flex.w6.gray.indent10.bg-white.py2
						.flex-max.omit.f5.dark {{x.itemMean || '暂无介绍'}}
						.font.mx3(@click='explain(x)') &#xe698;
			//- 		.flex.align-center.py2.border-brother-top(v-for='x in item.itemList') 
			//- 			.flex-max.omit {{x.itemDesc}}
			//- 			.font.mx3(@click='explain(x)') &#xe698;
			.bottom_bg.mb2
				//- .px3
				//- .py2 预约流程
				img.block.w10.pb2(src='../../images/flow.png')
			.bottom_bg.mb2
				.py2.px3 服务保障
				.flex.text-center.align-center
					.w34
						.font(style='color:#73CA47;font-size:50px;') &#xe654;
						.pb2 官方授权
					.w34 
						.font(style='color:#3DB6FF;font-size:50px;') &#xe618;
						.pb2 随时退
					.w34 
						.font(style='color:#F7B800;font-size:50px;') &#xe63b;
						.pb2 检后服务
		img.block.mx-auto(v-if='index===1' ,:src='comboObj.orgMedicalProcess'  onerror="this.src='http://ddys-back.diandianys.com/static/orgProcess/comboFlow.png'")
		.mx3.py2(v-if='index===2' v-html='comboObj.apponitmentNotice')
	.fixed.w10.left0.bottom0.text-center(style="height:50px;")
		a.floatl.inline-block.w4.gray(:href="'tel:4006609100'")
			.font.mt1(style="font-size:20px") &#xe616;
			.f5 咨询客服 
		.floatl.inline-block.w6.bg-primary.white.f3(style='line-height:50px' @click='submit') 提 交
	modal-load(:isModal ='loadIsModal')
	modal-hint(:isShow='hintIsModal',:content='hint')
	addID(:isShow='isShow' ,:cencle="cencle" ,:comfir="goAdd")
	.mask(v-if='textIsModal' @click='textIsModal=false')
		modal-text(:isShow='textIsModal',:content='content')
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalText from '../../component/modalText.vue'
import modalHint from '../../component/modalHint.vue'
import modalLoad from '../../component/modalLoad.vue'
import addID from '../../component/addID.vue'
export default {
	components: {
		modalText,
		modalLoad,
		modalHint,
		addID
	},
	data () {
		return {
			hint:'',
			content:'',
			hintIsModal:false,
			textIsModal:false,
			loadIsModal:true,
			isShow:false,
			index:0,
			comboObj:'',
			itemList:[],
			iconCalback:false,//点击首页按钮显示的内容
			channel:util.basePostData.channel
		}
	},
	mounted(){
		if(util.getQstr('patientId')){
			util.runToLogin(this)
		}
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('套餐详情')
			bookApi('ddyy.medical.combo.detail',{id:this.$route.params.id}).then((res) => {
				if(res.data.code==0){
					this.comboObj=res.data.obj
					this.itemList=res.data.obj.itemList
					// 分享
					var share={title:res.data.obj.orgName+'-'+res.data.obj.comboName+'-点点医生体检预约',desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
					util.jssdk(share)
				}else {
					util.hintIsModal(res.data.msg,this)
				}
				setTimeout(()=>{this.loadIsModal=false},100)
			})
			
		},
		jumpTo:function(val){

		},
		cencle:function () {
			this.isShow=false
		},
		goAdd:function () {
			util.setVal('addPatient',window.location.href)
			this.$router.push({path:'/addPatient'})
		},
		iconClickChange:function(){
			this.iconCalback=!this.iconCalback
		},
		explain:function (val) {
			// console.log(val.itemMean)
			this.textIsModal=true
			if(val.itemMean){
				this.content=val.itemMean
			}else if(val.applyCrowd){
				this.content=val.applyCrowd
			}else{
				this.content='暂无介绍'
			}
			console.log(this.textIsModal)
		},
		submit:function () {
			if(util.getQstr('channel')=='yhwy' && util.getQstr('isLogin')=='1' && !util.getQstr('patientId')){
				
				util.removeVal('userInfo')
			}
			if(!util.getVal('userInfo')){
			
				util.runToLogin(this)
				return false
			} 
			bookApi('ddyy.medical.pat.list.v2',{bookPatId:util.getVal('userInfo').patientId}).then((res)=>{
				if(res.data.code==0){
					if(res.data.obj.list.length<=0){
						this.isShow=true
						return false 
					}else{
						this.$router.push({path:'/verifyOrder/'+this.$route.params.id})
					}
				}else{
					util.hintIsModal(res.data.msg,this)
				}
			})
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
.iconCalback
	position fixed
	z-index 1
	cursor pointer
	right 10px
	width 30px 
	height 30px  
	top 65% 
	img
		width 30px 
		height 30px
	a 
		display block
		height 30px
		line-height 30px
		margin-top 2px
		text-align center
		border-radius 50%
		width 30px
		font-size 13px
		background #FFC45E
		color #fff
.cancleTitle
	text-align left
	padding-left 10px
	margin-top 10px
	font-size 15px
.text-decoration
	text-decoration underline
</style>