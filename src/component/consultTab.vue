<template lang="jade">
	.flex.bottom_bg.mb2
		router-link.w25.text-center.border-right.pb2(
			:class="{'active':currentTab==='consultFree'}",to="/consultFree")
			.block.my2
				img(src='http://www.wowys.com/static/ddysVuePic/inquiry.png' width="50px" height="50px")
			.block 免费咨询
		router-link.w25.text-center.border-right.pb2(
			:class="{'active':currentTab==='consultReward'}",to="/consultReward")
			.block.my2
				img(src='http://www.wowys.com/static/ddysVuePic/reward.png' width="50px" height="50px")
			.block 悬赏咨询
		router-link.w25.text-center.border-right.pb2(
			:class="{'active':currentTab==='consultTeam'}",to="/consultTeam")
			.block.my2
				img(src='http://www.wowys.com/static/ddysVuePic/team.png' width="50px" height="50px")
			.block 全科团队
		a.w25.text-center.border-right.pb2(href='http://weixin.diandianys.com/child/pat/?wxid=wxb416a4504b34bd1f#/tab/teamTab')
			.block.my2
				img(src='http://www.wowys.com/static/ddysVuePic/women-children.png' width="50px" height="50px")
			.block 妇儿专科
</template>


<script>

export default {
  name: 'consultTab',
  components: {
  },
  data () {
    return {
    }
  },
  props: [
    'currentTab'
  ]
}
</script>


<style lang="stylus">
.active
    color #2ECC40
</style>