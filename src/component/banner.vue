<template lang="jade">
.banner.m3
	.wrapper
		swiper(:options="swiperOption" v-if="showSwiper")
			swiper-slide(v-for="(item,index) in adList",:key='item.settingId')
				img(class="swiper-img",:src="item.adImg" ,@click="jump(item)")
			.swiper-pagination(slot="pagination")
</template>
<script>
import util from '../utils/util'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
	components: {
    swiper,
    swiperSlide
  },
	data () {
		return {
			swiperOption: {
        loop: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
      }
		}
	},
	props: [
		'adList'
	],
	mounted () {
  },
  computed: {
    showSwiper () {
      return this.adList.length
    }
  },
  methods: {
		initData:function () {
			window.timer=setInterval(this.runBanner,5000)
			this.fromX=document.body.clientWidth
			setTimeout(()=>{
				util.$('.banner').style.transition='transform 1s'
			},1000)
		},
		bannerTo:function(){
			if(this.adList[this.bannerIndex].clickLayout=='ORG'){
				//机构页
				this.$router.push({path:'/orgDetails/'+this.adList[this.bannerIndex].clickVal})
			}else if(this.adList[this.bannerIndex].clickLayout=='COMBO'){
				//详情页
				this.$router.push({path:'/comboDetails/'+this.adList[this.bannerIndex].clickVal})
			}
		},
		jump(val){
			if (val.clickLayout == 'COMBO') {
				this.$router.push('comboDetails/' + val.clickVal)
			} else if (val.clickLayout == 'ORG') {
				this.$router.push('orgDetails/' + val.clickVal)
			}
		},
// 手指向右执行fn
		touchRight:function () {
			console.log('right');
			// 轮播暂缓2秒
			clearInterval(timer)
			setTimeout(()=>{
			 window.timer=setInterval(this.runBanner,5000)
			},100)
			 this.fromX=util.$('.banner').style.transform
       this.fromX=Number( this.fromX.slice( this.fromX.indexOf("X")+2, this.fromX.indexOf("px")) )
       var newLeft= this.fromX+document.body.clientWidth;//当前的偏移量+下一次的偏移量=新的偏移量
       console.log(newLeft)

		 if(this.fromX<-(document.body.clientWidth)){
		 	util.$('.banner').style.transform='translateX('+newLeft+'px)'
		 	if(this.bannerIndex==0){
		 		this.bannerIndex=this.adList.length-1
		 	}else{
		 		this.bannerIndex--
		 	}
		 }else{
		 	this.bannerIndex=this.adList.length-1
		 	util.$('.banner').style.transform='translateX('+0+'px)'
		 	if(util.$('.banner').style.transform>='translateX(0px)'){
			 	util.$('.banner').style.transform='translateX('+-(document.body.clientWidth*(this.adList.length+1))+'px)'
				util.$('.banner').style.transition='transform 0s'
				 this.fromX=util.$('.banner').style.transform
       this.fromX=Number( this.fromX.slice( this.fromX.indexOf("X")+2, this.fromX.indexOf("px")) )
       var newLeft= this.fromX+document.body.clientWidth;//当前的偏移量+下一次的偏移量=新的偏移量
				// this.bannerIndex--
		 		util.$('.banner').style.transform='translateX('+newLeft+'px)'
				util.$('.banner').style.transition='transform 1s'


			}
		 }


		},
		// 手指向左执行fn
		touchLeft:function () {

			// 轮播暂缓2秒
			clearInterval(timer)
			setTimeout(()=>{
			 window.timer=setInterval(this.runBanner,5000)
			},100)
			console.log('left');
			this.runBanner()
		},
		//运行轮播
		runBanner:function(){
			if(util.$('.banner')){
				 this.fromX=util.$('.banner').style.transform
	       this.fromX=Number( this.fromX.slice( this.fromX.indexOf("X")+2, this.fromX.indexOf("px")) )
	       var newLeft= this.fromX-document.body.clientWidth;//当前的偏移量+下一次的偏移量=新的偏移量
	       console.log(newLeft)
			  if(this.fromX<=(-document.body.clientWidth)&&newLeft>-document.body.clientWidth*(this.adList.length+1)){
			 		this.bannerIndex++
			 		util.$('.banner').style.transform='translateX('+newLeft+'px)'
			  }else{
			 		this.bannerIndex=0
			 		util.$('.banner').style.transform='translateX('+newLeft+'px)'
			 		if(util.$('.banner').style.transform=='translateX('+-document.body.clientWidth*(this.adList.length+2)+'px)'){
				 		util.$('.banner').style.transform='translateX('+-document.body.clientWidth+'px)'
				 		util.$('.banner').style.transition='transform 0s'
				 		this.runBanner()
				 		util.$('.banner').style.transition='transform 1s'
					}
				}
		 	}
		},
  }
}
</script>

<style lang="stylus" scoped>
.banner
	border-radius 10px
.wrapper >>> .swiper-pagination-bullet
	display inline-block
	margin 0px 5px
	width 7px
	height 7px
	background #fff
	border-radius 50%
.wrapper >>> .swiper-pagination-bullet-active
	background #ffa052
.wrapper >>> .swiper-slide
	display inline-block
	width 100%
.wrapper >>> .swiper-container
	overflow-x: auto;
	white-space: nowrap;
.wrapper >>> .swiper-pagination
	position absolute
	bottom 10px
	left 0
	right 0
	text-align center
.wrapper
	position relative
	overflow hidden
	width 100%
	font-size 0
	border-radius 10px
.swiper-img
	width 100%
	border-radius 10px
</style>