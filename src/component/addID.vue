<template lang="jade">
	.addID.mask(
		@click="cencle"
		v-if='isShow'
		style="background-color:rgba(0,0,0,0.4)"
	)
		.contentText.bg-white.rounder(style="width:240px;" @click="stopP")
			.mx4.px2.pt4.round-min 请添加体检人信息
			.py4
				.btn(@click="comfir") 立即添加
</template>


<script>
import util from '../utils/util'
export default {
	name: 'addID',
	data () {
		return {
		}
	},
	props: {
		'isShow':false,
		'comfir':{type:Function, default: function () {
        return function(){
        }
      }},
    'cencle':{type:Function, default: function () {
      return function(){
       }
    }},
	},
	mounted () {
  },
  methods: {
		stopP:function () {
			util.stopP()
		}
  }
}
</script>

<style lang="stylus">
.contentText{
    position: absolute;
    text-align center;
    width:80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>