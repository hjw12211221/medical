<template lang="jade">
#home
	//- .fixed.bottom0.right0(@click="clear")
	//- 	button 清除
	.main(style="top:0;bottom:0")
		//- 搜索区
		//- 轮播图
		banner(:adList='adList' v-if="bannerIsShow")
		.absolute.w10.flex.mt2(style="top:15px")
			//- .ml2.mt1 杭州市
			router-link.w9.relative.mx-auto(to='/search')
				input.input-lg.f4(
					placeholder="机构/套餐",style="height:30px" disabled= "true"
				)
				font.input-search(style='margin-top:-10px') &#xe650;
		//- 按钮区
		div(style='font-size: 0;*word-spacing: -1px;')
			.inline-block.w25.text-center.box-sizing.pb2( v-for="(item,index) in items" ,:key="index" style='font-size: 15px;letter-spacing: normal;word-spacing: normal;' @click='jumpTo(item,index)',v-if="index<4")
				.my2.flex.xy-center(style='height:50px;line-height:50px')
					img(:src='item.typePic' width="40px")
				.block {{item.typeName}}
		//- 常见体检类型
		.bottom_bg.py2
			//- .p2.border-bottom 常见体检类型
			.omit2.mt1(style='font-size: 0;*word-spacing:-1px;')
				.flex.wrap
					.w25.my1.f45.text-center(v-for='(mType,index) in mTypeList' ,:key="index", v-if="index<8", @click="jumpCom(index,mType.id)")
						span.inline-block.lh_h25.primary.border(style='border-radius:15px;background-color:#fff3eb;width:75px;border:1px solid #ffc69b') {{mType.typeName}}
		//- 热门机构		
		center.mt2(style="color:#AAA;")
			.inline-block.mx4.py2(:class="{'primary primary-bottom':index==0}" @click="index=0") 热门机构
			.inline-block.mx4.py2(:class="{'primary primary-bottom':index==1}" @click="index=1") 热门套餐
		.pl3(v-if="index==0")
			router-link.flex.w10.py3(v-for='(org,index) in orgList',:to="'/orgDetails/'+org.id" ,:key="index", v-if='index<5')
				.relative
					img.block(:src='org.orgIndexPic' width='110px' height='75px' onerror="this.src='http://ddys-back.diandianys.com/static/org/orgDefault.png'")
					.absolute.left0.w10.bottom0.text-center.f5.white(style='height:20px;line-height:20px;background:rgba(255,125,19,0.8)') {{org.typeName}}
				.flex-max.mx3.omit
					.omit.mr2.f4 {{org.orgName}}
					.dark.my2.f5(style="color:#AAA;") {{org.comboNum}}项套餐
						span.mx3 
							span.primary {{org.orgOrderCount + org.realOrderCount}}
							| 人预约
					.gray.omit.font.f5 &#xe669; 
						span(style="font-size:12px;") {{org.address}}
		div(v-if="index==1")
			router-link.flex.align-center.w10.py2( v-for='(combo,index) in comboList' v-if='index<20' key="combo" ,:to="'/comboDetails/'+combo.id")
				.flex-max.pl3.omit(style='margin-right:10px')
					.f4 {{combo.comboName}}
					.f4.red.my2 {{combo.preferentPrice}}元 {{combo.discount | discount}}
						span.ml2.f5.gray 原价 {{combo.realPrice}}元 预约量 {{combo.comboOrderCount + combo.realOrderCount}}
					.f5.gray 体检机构: {{combo.orgName}}
					.gray.omit.font.my2.f5 &#xe669; 
						span(style="font-size:12px;") {{combo.address}}
					div(style='margin-right:-40px')
						span.inline-block.mr2.lh_h25.round.px1.border( v-for='(type,index) in combo.typeList' key="type" v-if='index<3' ,:style="{borderColor:colors[index],color:colors[index]}") {{type.typeName}} 
				.font.gray.mr3 &#xe625;	
		center.py2
			router-link.block.w6.border.lh_h40(style="border-radius:40px;color:#AAA;" ,:to="index==0?'/orgHome':'/comboHome'") 查看更多
		.bottom_bg
	modal-load(:isModal ='loadIsModal')
	modal-hint(:isShow='hintIsModal',:content='hint')
	.mask(v-if='isMask==true')
		.contentText(style="top:53%;")
			div( @click="publish(6)")
				img.mb4(src="../../images/advertising.png")
			img.mx-auto(src="../../images/close.png" width="30px;" @click="isMask=false")
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalLoad from '../../component/modalLoad.vue'
import modalHint from '../../component/modalHint.vue'
import banner from '@/component/banner.vue'
import config from '../../utils/config.js'
export default {
	components: {
		banner,
		modalLoad,
		modalHint
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			loadIsModal:true,
			isMask:false,
			colors:['#F9C738','#67C6FF','#92D66F'],
			orgList:[],
			comboList:[],
			mTypeList:'',
			adList:'',
			index:0,
			bannerIsShow:true,
			items:[
				{typePic: require('../../images/jg.png'),typeName:'找机构',link:'/orgHome'},
				{typePic: require('../../images/tc.png'),typeName:'找套餐',link:'/comboHome'},
				{typePic:require('../../images/jkbk.png'),typeName:'健康自测',link:''},
				{typePic:require('../../images/people.png'),typeName:'我的体检',link:'/myMedical'},
				{typePic:'http://www.wowys.com/static/medicalVuePic/my-medical.png',typeName:'我的体检',link:'/myMedical'},
				{typePic:'http://www.wowys.com/static/medicalVuePic/query.png',typeName:'报告查询',link:'http://weixin.wowys.com/HTML/woys.html#/baogaoHos'},
				{typePic:'http://www.wowys.com/static/medicalVuePic/unscramble.png',typeName:'报告解读',link:''},
				{typePic:'http://www.wowys.com/static/medicalVuePic/consult.png',typeName:'咨询医生',link:'https://ddys-wechat.diandianys.com/WeChat/new-consult/#/home'}
			],
			imgHeight:'',		
		}
	},
	mounted () {
		this.initData()
		if (util.getQstr('channel')) {
			sessionStorage.setItem('channel',util.getQstr('channel'))
		}
		if (util.getQstr('from')) {
			sessionStorage.setItem('from',util.getQstr('from'))
			if (sessionStorage.getItem('from') != 'lxap') {
				util.initData()
			}
		} else {
				util.initData()
		}
	},
	methods: {
		initData: function () {
			util.setTitle('体检预约')
			if(window.navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger')>= 0&&!sessionStorage.getItem('key_a')&&(Date.parse(new Date())/ 1000)>1512349200&&(Date.parse(new Date())/ 1000)<1513440000){
				this.isMask=true
				window.sessionStorage.setItem('key_a', '1')
			}
			var url=window.location.href;
				var index=url.indexOf('#');
			bookApi('ddyy.medical.index.info').then((res) => {
			// 分享
			var share={title:"点点医生体检预约，杭州体检预约官方平台",desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
			util.jssdk(share)
				if(res.data.code==0){
					res.data.mTypeList.list.push({'typeName':'团体体检'})
					this.mTypeList=res.data.mTypeList.list
					this.comboList=res.data.comboList.list
					this.orgList=res.data.orgVoList.list	
					this.adList=res.data.adSettingList
				}else{
					util.hintIsModal(res.data.msg,this)
				}
				this.loadIsModal=false
			}).catch(function (error) {
				util.hintIsModal('系统错误,稍后重试',this)
			});
		},
		publish:function (type) {
			if(type===6){
					bookApi('ddyy.sys.click.add',{clickLocation:'12-04体检活动至12-16'}).then((res)=>{
						location.href='https://wx.m.shangjiadao.cn/sjd_0?activity=148228&type=30'
					})
				}
		},
		jumpTo:function (val,idx) {
			if(idx != 2){
				this.$router.push({path:val.link})
			}else{
				window.location.href="https://ddys-wechat.diandianys.com/WeChat/jkbk/#/test?test=1"	
			}
		},
		jumpCom (index,id) {
			if (index<7) {
				this.$router.push('/comboHome?typeId='+id)
			} else {
				this.$router.push('/team')
			}
		},
		clear () {
			window.localStorage.clear()
		}
	},
	watch:{
	}
}
</script>
<style lang="stylus">
.bt-gray
	background #dcdcdc
	color #fff
</style>
