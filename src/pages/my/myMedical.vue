<template lang="jade">
#myMedical
	.bg-fixed
	//- .header
	//- 	.left(onclick="window.history.go(-1)")
	//- 		.font(color="#666") &#xe61f;
	//- 	.title
	//- 		| 我的体检
	//- 	.right.font.f1(@click='myPatient') &#xe621;
	transition(name="fade")
		.barFixed(v-if="showBar")
			img(src="../../images/float.png" @click='myPatient')
	.containts
		.flex.bottom_bg.align-center.mb2
			.w25.py3.bg-white.text-center(@click="jumpTo(1)")
				.pic.text-center.mx-auto(style="width:25px;height25px")
					img.block.w10.h10(src="../../images/bgcx.png")
				.f4.mt2 报告查询
			.w25.py3.bg-white.text-center(@click="jumpTo(2)")
				.pic.text-center.mx-auto(style="width:25px;height25px")
					img.block.w10.h10(src="../../images/zx.png")
				.f4.mt2 咨询医生
			.w25.py3.bg-white.text-center(@click="jumpTo(3)")
				.pic.text-center.mx-auto(style="width:25px;height25px")
					img.block.w10.h10(src="../../images/dd.png")
				.f4.mt2 名医支招
			.w25.py3.bg-white.text-center(@click="jumpTo(4)")
				.pic.text-center.mx-auto(style="width:25px;height25px")
					img.block.w10.h10(src="../../images/jkbks.png")
				.f4.mt2 健康百科
		.px3.bg-white.border-bottom(v-for='(x,index) in list')
			.py2.flex.handle-border-bottom
				.flex-max 体检人: {{x.medicalPerson}}
				.gray.f5 {{x.orderState}}
			.py1 套餐: {{x.comboName}}
			.py1.red {{x.unitPrice}}元 {{x.payMentText}}
			.py1.gray.f5 时间: {{x.dateYMD}} {{x.medicalWeek}}
			.py1.dark.f5 体检机构:{{x.orgName}}
			.py1.gray.f5.font.omit &#xe669; {{x.address}}
			.text-right.pb2.pt2
				router-link.btn.bg-white.border(style='color:#999;font-size:15px;' ,:to="'/comboDetails/'+x.comboId") 查看套餐项目
				span.btn.ml3(style='font-size:15px;' @click='operation(x,true)' v-if="x.operationText&&x.operationText=='去支付'&&x.handleStatus==0") 取消
				span.btn.ml3(style='font-size:15px;' @click='operation(x)' v-if="x.operationText&&x.visitStatus!='1'", :class="{notClick:x.operationText=='取消'&&(x.medicalDate-nowDate)<0}") {{x.operationText}}
	modal-hint(:isShow='hintIsModal',:content='hint')
	.modalText.mask(v-if='refund==true')
		.contentText.bg-white(v-if='index===0')
			//- .modal-title.py4.f2(v-if='!cancelOrder') 取消订单？
			.modal-title.py4.f2(v-if='!cancelOrder') 取消订单？
			//- .modal-content.py1.f3.mb4(v-if='!cancelOrder') 确认取消订单
			.modal-content.py1.f3.mb4(v-if='!cancelOrder') 
				p.cancleTitle.px2 若体检时间不合适，可以联系客服修改体检时间。
				//- p.cancleTitle 客服电话：0571-85890223
			.modal-footer.flex.justify-around()
				.btn.w5(style='box-sizing: border-box;height:40px;line-height:40px;border-radius:0;background: #ddd;' @click='cancel') 确认取消
				a.bg-primary(href='tel:0571-85890223' style='font-size:17px;display: inline-block; width: 50%;height:40px;line-height:40px;color:#fff;  border-radius:0' @click='refund=false') 联系客服
		.contentText.bg-white(v-if='index===1')
			.modal-title.py4.f2 填写退款信息
			.modal-content.py1.mb4(style='text-align:left;')
				.flex.py1
					.mx3(style='width:70px;') 支付宝:
					input.flex-max.mr3.border-bottom(v-model='userMobile')
				.flex.py1
					.mx3(style='width:70px;') 姓名:
					input.flex-max.mr3.border-bottom(v-model='userName')
			.modal-footer.flex.justify-around()
				.btn.w5(style='height:40px;line-height:40px;color:#aaa;background-color:#eee;  border-radius:0' @click='refund=false;index=0;') 取消
				.btn.w5.primary(style='height:40px;line-height:40px;border-radius:0' @click='cancel') 确认
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalLoad from '../../component/modalLoad.vue'
import modalHint from '../../component/modalHint.vue'
export default {
	components: {
		modalHint,
		modalLoad
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			modalList:false,
			list:[],
			pageNo:1,
			index:0,
			refund:false,
			val:'',
			userMobile:'',
			userName:'',
			payCancel:false,//支付旁边的取消
			nowDate:0,//获取当前时间
			cancelOrder:false,//取消支付订单(取消订单?)
			notPay:false,
			topValue: 0,
			interval: null,
			showBar:true
		}
	},
	mounted(){
		// console.log(util.basePostData.channel)
		// util.isLogin(location.href)
		// console.log(util.getVal('userInfo'))
		// return false
		if (!util.getQstr('patientId') && !util.getVal('userInfo')) {
				util.runToLogin(this)
		} else {
			if (util.getQstr('patientId')) {
				util.runToLogin(this)
				this.initData({bookPatId:util.getQstr('patientId')})
			} else if(util.getVal('userInfo')) {
				this.initData({bookPatId:util.getVal('userInfo').patientId})
			}
		}
		this.nowDate=new Date().getTime();
		var _this = this
		document.onscroll =function () {
			_this.showBar = false
			if (_this.interval == null) {
				_this.showBar = false
				_this.interval = setInterval(_this.test,1000)
				_this.topValue = document.body.scrollTop
			}
		}
	},
	methods:{
		initData:function (obj) {
			// util.runToLogin(this)
			util.setTitle('我的体检')
			bookApi('ddyy.medical.order.list',obj).then((res) => {
				if(res.data.code==0){
					res.data.obj.list.forEach(function(value,index,array){
						array[index].dateYMD=util.formatDate(new Date(array[index].medicalDate))
						// 支付方式
						if(array[index].payMent&&array[index].payMent==='1'){
							array[index].payMentText='线下支付'
						}else if(array[index].payMent&&array[index].payMent==='0'){
							array[index].payMentText='微信支付'
						}
						if(array[index].medicalStatus==='0'){
							array[index].orderState='已取消'
							array[index].operationText=''
						}else{
							array[index].orderState=util.orderState(array[index].payStatus)
							if(array[index].orderState=='待支付'){
								if(array[index].payMent&&array[index].payMent==='1'){
									console.log(1)
									array[index].orderState='预约成功'
									array[index].operationText='取消'
								}else{
									array[index].operationText='去支付'
								}
							}else if(array[index].orderState=='已支付'){
								if(array[index].visitStatus==='0'){//待体检
									array[index].orderState='待体检'
								}else if(array[index].visitStatus==='1'){//已体检
									array[index].orderState='已体检'

								}
								array[index].operationText='取消'
							}
						}

					})
					if(this.pageNo===1){
						this.list=res.data.obj.list
					}else{
						this.list=[...this.list,...res.data.obj.list]
					}
					
					}else {
						console.log('error',res.data.msg)
					}
			})	
		},
		myPatient:function () {
			this.$router.push({path:'/patient'})
		},
		operation:function(x,cancel){
			if(x.orderState==="已支付"){
				this.cancelOrder=true
			}else if(x.orderState==="待支付"){
				this.notPay=true
			}
			if(cancel){//如果是支付旁边的取消按钮
				this.refund=true
				this.val=x
				this.payCancel=true
			}else if(x.payStatus==='1'&&x.payMent!=='1'){//支付
				var url=window.location.href;
				if(url.indexOf('?')<0||url.indexOf('?')>url.indexOf('#')){
					var index=url.indexOf('#');
					url=url.substring(0,index)
					window.location.href=url+'?adasd=sada#/pay/'+x.orderId+'/'+1
				}else{
					this.$router.push({path:'/pay/'+x.orderId+'/'+1})
				}
			}else if(x.payStatus==='0'||x.payMent==='1'){//取消预约
				//当前时间减去预约的时间
				var isDisable=this.nowDate-x.medicalDate
				if(isDisable>0){//如果大于0，说明在预约当天(或者之后)
					util.hintIsModal("预约当天不能取消!",this)
					return
				}
				this.refund=true
				this.val=x
			}
		},
		cancel:function(){
			var x=this.val
				bookApi('ddyy.medical.order.cancel',{
					orderId:x.orderId
				}).then((res) => {
					if(res.data.code==0){
						this.modalList=true
						x.orderState='已取消'
						x.operationText=''
						setTimeout(()=>{
							this.modalList=false
							this.refund=false
							this.index=0
						},500)
					}else{
						this.refund=false
						this.index=0
						util.hintIsModal(res.data.msg,this)
					}
				})
		},
		cancelBefore:function(){
			console.log(this.notPay);
			if(this.notPay){
				this.index=0
				this.cancel()
				return
			}
			// if(this.payCancel){
			// 	this.cancel()
			// }else 
			if(this.val.payMent==='1'){
				this.cancel()
			}else{
				this.refund=true
				this.index=1
			}
		},
		jumpTo (index) {
			if (index == 1) {
				location.href = 'https://ddys-wechat.diandianys.com/WeChat/select-report/#/'
			} else if (index == 2) {
				location.href = 'https://ddys-wechat.diandianys.com/WeChat/new-consult/#/home'
			} else if (index == 3) {
				location.href = 'https://ddys-wechat.diandianys.com/WeChat/video/#/home'
			} else {
				location.href = 'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home'
			}
		},
		test () {
			if (document.body.scrollTop == this.topValue) {
				// console.log('静止了')
				this.showBar = true
				clearInterval(this.interval)
				this.interval = null
			}else {
				this.showBar = true
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
.main
	top 0
.notClick
	background:#ddd
.h10
	height 100%
.barFixed
	position fixed
	bottom 20%
	z-index 101
	right 10px
	width 50px
.fade-enter-active, .fade-leave-active
	transition opacity .2s
.fade-enter, .fade-leave-to
	opacity 0
</style>