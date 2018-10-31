
<template lang="jade">
#myCoupon
	.bg-fixed
	.m3
		.bg-white.flex.py4.px3.rounder.align-center
			.flex-max.f5
				.dark.f3.mb2 体检券
				.gray 订单满1000元使用
				.gray 有效期:2017.03.01 - 2017.05.31
			.mx3
				.red.f1 50元
				.red.text-center 未使用
</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'

export default {
	components: {
	},
	data () {
		return {
			key:'',
			list:[]
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('我的优惠券')
			bookApi('ddyy.medical.recommend.list').then((res) => {
				if(res.data.code==0){
					}else {
						console.log('error',res.data.msg)
					}
			})
			
		},
		jumpTo:function(val){

		},
		
	},
	watch: {


	}
}
</script>