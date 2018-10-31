<template lang="jade">
  .header
    .left(onclick="window.history.go(-1)")
      .font(v-if="hasLeft",color="#666")&#xe61f;
    .title
      | {{title}}
    .right
      | {{rightText}}
</template>
<script>
export default {
  name: 'Headers',
  components: {
  },
  data () {
    return {
    }
  },
  props: [
    'title',
    'hasLeft',
    'rightText'
  ]
}
</script>


<style lang="stylus">
/*@import '../app_variables.styl'*/

</style>