<template lang="jade">
#app
	keep-alive
		router-view(:key="$route.fullPath", v-if="$route.meta.keepAlive")
	router-view(:key="$route.fullPath", v-if="!$route.meta.keepAlive")
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang='stylus'>
	@import './app.styl'
</style>