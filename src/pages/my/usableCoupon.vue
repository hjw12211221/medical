<template lang="jade">
#usableCoupon
	.bg-fixed
	.main(style='top:0;bottom:0')
		center.gray.py2.mt3.mx3.bg-white.rounder(@click="option('-1')" v-if="list.length>0") 取消使用优惠券
		.m3(v-for='(x,index) in list' @click='option(x,index)')
			.bg-white.py4.px3.rounder.flex(:class="{'bg-gray':x.leastAmount>price,'white':x.leastAmount>price}")
				//- .red.f3.text-center.py2 {{x.amount}}元 (满{{x.leastAmount}}元使用)
				.coupon-item-left.flex-max
					h3.item-title 体检券
					.item-detail 订单满{{x.leastAmount}}元使用
					.item-time 有效期{{timeList[index].createTime}} - {{timeList[index].endTime}}
				.coupon-item-right(:class="{'item-right-color':status[index]=='已过期'}")
					.item-money {{x.amount}}元
					.item-not-use {{status[index]}}
		.mask-center(v-if="list.length==0")
			center.gray.f3 暂无优惠券
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
			price:'',
			timeList:[],
			status:[],//优惠券的使用状态
		}
	},
	mounted(){
		// util.isLogin(location.href)
		this.initData()
		this.price=this.$route.params.price
	},
	methods:{
		initData:function () {
			util.setTitle('可使用优惠券')
			bookApi('ddyy.medical.coupon.list',{
				// mobile:util.getVal('userInfo').patientMobile,
				patientId: util.getVal('userInfo').patientId,
				leastAmount:this.$route.params.price
			}).then((res) => {
				if(res.data.code==0){
					this.list=res.data.obj.list
					var _this=this
					this.list.forEach(function(val,index){
						_this.timeList.push({"createTime":util.formatDate(new Date(val.createTime),'',true),"endTime":util.formatDate(new Date(val.endTime),'',true)})
						if(new Date().getTime()>val.endTime){
							_this.status.push('已过期')
						}else if(val.status=='0'){
							_this.status.push('未使用')
						}else if(val.status=='1'){
							_this.status.push('已使用')
						}
					})
				}else {
					console.log('error',res.data.msg)
				}
			})
			
		},
		option:function(val,index){
			if(index&&this.status[index]=='已过期'){
				return
			}
			if(val=='-1'){
				localStorage.removeItem(util.name+"coupon");
			}else{
				util.setVal('coupon',val)
			}
			
			window.history.go(-1)
		},
		
	},
	watch: {
	}
}
</script>
<style lang='stylus' scoped>

.coupon-item
	margin-top 10px
	background #fff
	border-radius 10px
	padding 15px
	font-size 14px
	@media screen and (max-width 320px){
		padding 10px
		font-size 12px
	}
.item-title
	padding-bottom 10px
	font-size 20px
	font-weight bold
.item-detail
	color #adaaaa
.item-time
	color #adaaaa
.item-money
	padding-top 10px
	text-align center
	font-size 23px
	font-weight bold
	padding-bottom 9px	
.item-not-use
	font-size 15px
	text-align center
.coupon-item-right
	color #ef1919
.item-right-color
	color #ccc
.mask-center
	center 
		margin-top 60%
</style>