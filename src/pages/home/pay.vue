<template lang="jade">
#pay
	.bg-fixed
	.px3.bg-white
		.flex.align-center.border-bottom
			.flex-max 支付金额
			.gray.py2 {{orderInfo.unitPrice}}元
		router-link.flex.align-center.border-bottom(:to="'/usableCoupon/'+orderInfo.unitPrice",v-if="type=='TJYY'")
			.flex-max 优惠券
			.gray.py2 {{couponText}}
				span.font &#xe635;
		.flex.align-center
			.flex-max 支付金额
			.red.bold.py2 {{payPrice}}元
	.py2.mx3.f5.dark 选择支付方式
	.px3.bg-white(v-if="fromType=='lxap'")
		.flex.align-center.border-bottom.py1(@click='payMent=0')
			img.mr1(src="../../images/zfb.png" width="30")
			.flex-max 支付宝
			.font.font-md.primary(v-if='payMent===0') &#xe61a;
			.font.font-md(v-if='payMent===1') &#xe64a;

	.px3.bg-white(v-else)
		.flex.align-center.border-bottom(@click='payMent=0')
			.flex-max.py1
				span.font.font-md.mr2.v-middle.green &#xe62a;
				| 微信支付
			.font.font-md.primary(v-if='payMent===0') &#xe61a;
			.font.font-md(v-if='payMent===1') &#xe64a;

		//- .flex.align-center(@click='payMent=1')
		//- 	.flex-max.py1
		//- 		span.font.font-md.mr2.v-middle(style='color:#F7B800') &#xe6a5;
		//- 		| 线下支付
		//- 	.font.font-md.primary(v-if='payMent===1') &#xe61a;
		//- 	.font.font-md(v-if='payMent===0') &#xe64a;
	button.btn-block(style='margin-top:40px' @click='submitPay') 确认支付
	modal-load(:isModal ='loadIsModal')
	modal-hint(:isShow='hintIsModal',:content='hint')
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalLoad from '../../component/modalLoad.vue'
import modalHint from '../../component/modalHint.vue'
export default {
	components: {
		modalLoad,
		modalHint
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			loadIsModal:false,
			flag:false,
			payMent:0,
			couponText:'',
			orderInfo:'',
			payPrice:'',
			type:'TJYY',//默认体检预约类型
			fromType: ''
		}
	},
	mounted(){
		this.initData()	
		if (sessionStorage.getItem('from')) {
			this.fromType = sessionStorage.getItem('from')
		}
		console.log(this.fromType)
	},
	methods:{
		initData:function () {
			util.setTitle('订单支付')
			// 非体检支付项目
			if(util.getQstr('type') && util.getQstr('type')!=this.type){
				this.type=util.getQstr('type')
				// 预约挂号支付项目
				if(this.type=='YYGH'){
					this.payPrice=util.getQstr('num')
					this.orderInfo={'unitPrice':this.payPrice=util.getQstr('num')}
				}
			}else{
				bookApi('ddyy.medical.order.info',{
					orderId:this.$route.params.orderId
				}).then((res) => {
					if(res.data.code==0){
						this.orderInfo=res.data.obj
						console.log(res.data.obj)
						this.payPrice=this.orderInfo.unitPrice
						if(!util.getVal('coupon')){
							this.coupon()
						}else{
							this.checkCoupon()
						}
					}else {
						console.log('error',res.data.msg)
					}
				})
			}
		},
		checkCoupon:function(){
			if(util.getVal('coupon')&&util.getVal('coupon').leastAmount<this.orderInfo.unitPrice){
				this.couponText=util.getVal('coupon').amount
				this.payPrice=this.orderInfo.unitPrice-util.getVal('coupon').amount
			}else{
				localStorage.removeItem(util.name+"coupon");
				this.coupon()
			}
		},
		coupon:function(){
			// 优惠券
			bookApi('ddyy.medical.coupon.list',{
				// mobile:util.getVal('userInfo').patientMobile,
				patientId: util.getVal('userInfo').patientId,
				leastAmount:this.orderInfo.unitPrice
			}).then((res) => {
				if(res.data.code==0){
					if(res.data.obj.list.length>0){
						this.couponText='有可用优惠券'
					}else{
						this.couponText='无可用优惠券'
					}
				}else {
					console.log('error',res.data.msg)
				}
			})
		},
		submitPay:function(){
			var _this=this
			this.flag=true
			if(util.getVal('coupon')){
				var couponId=util.getVal('coupon').couponId
			}
			if(this.type=='TJYY'){
				var service='ddyy.medical.order.pay'
					var obj={}
				if(this.fromType == 'lxap') {
					this.payMent = 2
					 obj={//支付宝
						bookPatId:this.$route.params.bookPatId,
						orderId:this.$route.params.orderId,
						payMent:this.payMent,
						couponId:couponId||'',
						payChannel:'2'
					}
				} else{ 
					this.payMent = 0
					 obj={
						bookPatId:this.$route.params.bookPatId,
						orderId:this.$route.params.orderId,
						payMent:this.payMent,
						couponId:couponId||'',
						pingxxOpenid:util.getVal('weChat').openid,
						payChannel:'1'
					}
				}
			}else{
				// console.log(util.getVal('userInfo'))
				var service='ddyy.book.clinic.insure.order.pay'
				// console.log(localStorage.getItem('ddys_weChat'))
				var obj={
					payWay:'2',
					payCopies:this.payPrice,
					bookOrderId:this.$route.params.orderId,
					openid: util.getVal('weChat').openid
				}
			}
			obj.patientId=util.getVal('userInfo').patientId
			bookApi(service,obj).then((res)=>{
				if(res.data.code==0){
					util.removeVal("coupon");
					if(this.payMent===0){
					console.log(res.data.obj)
					var payObj=res.data.obj
				  bookApi('ddyy.system.wechat.jsapiticket.get', {
				    appId: util.wxid,
				    reqUrl: location.href
				  }, '1').then((res) => {
				    var config = res.data.obj
				    wx.config(config); 
				    wx.ready(function(){
				      console.log('config',config)
							wx.chooseWXPay({
								timestamp: payObj.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: payObj.nonce_str, // 支付签名随机串，不长于 32 位
								package: 'prepay_id='+payObj.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
								signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: payObj.pay_sign, // 支付签名
 								success: function (res) {
 									util.hintIsModal('支付成功',this)
									setTimeout(()=>{
										if(_this.type=="YYGH"){
											util.jumpTo({'name':'预约挂号','goToType':'router','loginState':true,'hash':'paySucess'})
										}else{
											_this.$router.push({path:'/myMedical'})
										}
									},2000)
								// 支付成功后的回调函数
								},
								fail: function(res) {
									// console.log('FAILres',res)
									if(this.type=='YYGH'){
										util.jumpTo({'name':'预约挂号','goToType':'router','loginState':true,'hash':'myAppointment'})
									}
				          //接口调用失败时执行的回调函数。
				        },
				        complete: function(res) {
				        	console.log('completeres',res)
				            //接口调用完成时执行的回调函数，无论成功或失败都会执行。
				           // util.jumpTo({'name':'预约挂号','goToType':'router','loginState':true,'hash':'#/myAppointment'})
				        },
				        cancel: function(res) {
				        	if(this.type=="YYGH"){
				        		util.jumpTo({'name':'预约挂号','goToType':'router','loginState':true,'hash':'myAppointment'})
				        	}
				            //用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
				        },
				        trigger: function(res) {
				        	console.log('trigger',res)
				            //监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
				        }
							});
				    })

				  })
						/*pingpp.createPayment(charge, (result, err)=>{
						  if (result == "success") {
						    // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
						    util.hintIsModal('支付成功',this)
								setTimeout(()=>{
									this.$router.push({path:'/myMedical'})
								},2000)
						  } else if (result == "fail") {
								 localStorage.removeItem("weChat");
								 window.location.href()
						    // charge 不正确或者微信公众账号支付失败时会在此处返回
						  } else if (result == "cancel") {
						    // 微信公众账号支付取消支付
						  }
						  this.flag=false
						});*/
					}else if(this.payMent===1){
						this.flag=false
						util.hintIsModal('成功',this)
						setTimeout(()=>{
							this.$router.push({path:'/myMedical'})
						},2000)
					}else if(this.payMent===2){
						// console.log(res.data.obj)
						const div = document.createElement('div')
						div.innerHTML = res.data.obj 
						document.body.appendChild(div)
						document.forms[0].submit()
					}
				}else{
					this.flag=false
					util.hintIsModal(res.data.msg,this)
				}
			})
			

		},
		
	},
	watch: {


	}
}
</script>