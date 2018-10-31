<template lang="jade">
	div
		modal-hint(:isShow='hintIsModal',:content='hint')
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalHint from '../../component/modalHint.vue'

export default {
	components:{
		modalHint
	},
	data () {
		return {
			patientId:'',
			bookOrderId:'',
			openid:'',
			hint:'',
			hintIsModal:false,			
		}
	},
	mounted(){
		util.setTitle('支付')
		this.patientId = 
		util.getQstr('patientId')
		this.bookOrderId = util.getQstr('bookOrderId')
		this.openid = util.getQstr('openid')
		this.initData()		
	},
	methods:{
		initData() {
			bookApi('ddys.apiBookFamousService.famous.order.pay',{patientId:this.patientId,bookOrderId:this.bookOrderId,openid:this.openid}).then((res)=>{
        if(res.data.code == 0){
					var payObj=res.data.obj
					bookApi('ddyy.system.wechat.jsapiticket.get', {
				    appId: util.wxid,
				    reqUrl: location.href
				  }, '1').then((res) => {
				    var config = res.data.obj
				    wx.config(config); 
				    wx.ready(function(){
							wx.chooseWXPay({
								timestamp: payObj.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: payObj.nonce_str, // 支付签名随机串，不长于 32 位
								package: 'prepay_id='+payObj.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
								signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: payObj.pay_sign, // 支付签名
 								success: function (res) {
 									util.hintIsModal('支付成功',this)
									setTimeout(()=>{
										util.jumpTo({'name':'名医挂号','goToType':'router','loginState':true,'hash':'#/appointmentOk/1'})
									},2000)
								// 支付成功后的回调函数
								},
								fail: function(res) {
									// console.log('FAILres',res)
									util.jumpTo({'name':'名医挂号','goToType':'router','loginState':true,'hash':'#/notPay'})
				            //接口调用失败时执行的回调函数。
				        },
				        complete: function(res) {
				        	console.log('completeres',res)
				            //接口调用完成时执行的回调函数，无论成功或失败都会执行。
				           // util.jumpTo({'name':'预约挂号','goToType':'router','loginState':true,'hash':'#/myAppointment'})
				        },
				        cancel: function(res) {
				        	util.jumpTo({'name':'名医挂号','goToType':'router','loginState':true,'hash':'#/notPay'})
				            //用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
				        },
				        trigger: function(res) {
				        	console.log('trigger',res)
				            //监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
				        }
							});
				    })

				  })						
        }else {
        	util.hintIsModal(res.data.msg,this)
        }
      })
		},
		

		
	},
	watch: {


	}
}
</script>