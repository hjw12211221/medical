<template lang="jade">
#orgDetails
	.iconCalback(@click="iconClickChange")
		img(src="../../images/home_icon.png")
		router-link.flex-max.relative(to='/home' v-if="iconCalback") 首页
		router-link.flex-max.relative(to='/orgHome' v-if="iconCalback") 机构
		router-link.flex-max.relative(to='/comboHome' v-if="iconCalback") 套餐
	.bottom_bg.mb2
		img.block(v-if='orgObj.orgIndexPic' ,:src='orgObj.orgIndexPic' onerror="this.src='http://ddys-back.diandianys.com/static/org/orgDefault.png 0'")
		.py2.px3.border-bottom 机构名称: {{orgObj.orgName}}
		.py2.px3.border-bottom 地址: {{orgObj.address}}
		a.flex.px3.align-center(v-bind:href="'tel:0571-85890223'")
			.flex-max.py2 咨询客服: 0571-85890223
			.font.gray.f1 &#xe619;
	.flex.text-center
		.w34(@click='toggle(0)')
			span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index==0}") 体检套餐
		.w34(@click='toggle(1)')
			span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index==1}") 机构介绍
		.w34(@click='toggle(2)')
			span.inline-block.lh_h40.box-sizing(:class="{'primary-bottom':index==2}") 体检须知
	div(v-if='index==0&&comboList.length>0' )
		.py2.px3.border-top(v-for='(combo,index) in comboList' @click='jumpTo(combo)')
			.omit
				.f4 {{combo.comboName}}
				.f4.red.my2 {{combo.preferentPrice}}元 {{combo.discount | discount}}
					span.ml2.f5.gray 原价 {{combo.realPrice}}元 预约量 {{combo.comboOrderCount+combo.realOrderCount}}
				div
					span.inline-block.mr2.lh_h25.round.px1.border( v-for='(type,index) in combo.typeList' v-if='index<=2', :style="{borderColor:colors[index],color:colors[index]}") {{type.typeName}} 
			p.f5.pt2.gray.lh18.omit3 适用人群: {{combo.applyCrowd}}
	div.m3(v-if='index==1' v-html="orgObj.orgIntro") 
	div.m3(v-if='index==2' v-html='orgObj.appointmentNotice')
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'

export default {
	components: {
	},
	data () {
		return {
			colors:['#F9C738','#67C6FF','#92D66F'],
			orgObj:'',
			index:0,
			comboList:[],
			iconCalback:false,
		}
	},
	mounted(){
		this.initData()
		if (util.getVal('weChat') && util.getVal('weChat') != null) {
			
		} else {
		  util.initData()
		}
		// if(util.getQstr('channel')){
			// this.$store.commit('change', {tabTo:location.hash.slice(1,location.hash.length)});
			if(util.basePostData.channel=='yhwy'){
				// 返回操作
				// 	window.addEventListener("popstate", function(e) {
				// 	if(util.getVal('userInfo')){
				// 		window.location.href = "http://test-ddys-wechat.hztywl.cn/WeChat/yhwy/#/home?patientId="+util.getVal('userInfo').patientId
				// 	}else{
				// 		window.location.href ="http://test-ddys-wechat.hztywl.cn/WeChat/yhwy/#/home?patientId=1"
				// 	}
				// }, false); 
				// 余杭五院通过'isLogin'字段判断登录状态
				if(util.getQstr('isLogin')==='1'){
					util.removeVal('userInfo')
					// console.log(util.jumpTo({name:'余杭五院登录',goToType:'link',gotoFalse:true}))
					util.loginURL=util.jumpTo({name:'余杭五院登录',goToType:'link',gotoFalse:true})
				}else{
					util.runToLogin(this,null,'isLogin')
				}
			}	
			
		// }
	},
	methods:{
		// this.$route.params.id
		initData:function () {
			util.setTitle('机构详情')
			bookApi('ddyy.medical.org.detail',{id:this.$route.params.id}).then((res) => {
				if(res.data.code==0){
							// 分享
						this.orgObj=res.data.obj
						this.comboList=res.data.obj.comboList
						var share={title:this.orgObj.orgName+"-点点医生体检预约",desc:"1分钟预约，5折起，省时省钱",imgUrl:this.orgObj.orgIndexPic,link:location.href}
						util.jssdk(share)
					}else {
						console.log('error',res.data.msg)
					}

			})
		},
		jumpTo:function(val){
			this.$router.push({path:'/comboDetails/'+val.id})
		},
		toggle:function (num) {
			this.index=num
		},
		iconClickChange:function(){
			this.iconCalback = !this.iconCalback
		},
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
</style>
