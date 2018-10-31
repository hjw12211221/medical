<template lang="jade">
	.modalText(
		v-if='isShow'
	)
		.contentText.bg-white.rounder
			p.mx4.pt3.pb2.round-min {{content}}
</template>


<script>
export default {
	name: 'modal-text',
	data () {
		return {
		}
	},
	props: [
		'isShow',
		'content'
	],
	mounted () {
  },
  methods: {
  }
}
</script>

<style lang="stylus">

.modalText .contentText{
    position: absolute;
    text-align center;
    width:80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>