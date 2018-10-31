<template lang="jade">
	.modalHint.mask(
		v-if='isShow'
		style="background-color:rgba(0,0,0,0.4)"
	)
		.contentText.bg-white.rounder(style="width:auto;")
			.mx4.p2.round-min {{content}}

</template>


<script>
export default {
	name: 'modal-hint',
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
</style>