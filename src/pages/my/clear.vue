
<template lang="jade">
#clear
	.bg-fixed
</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'

export default {
	components: {
	},
	data () {
		return {
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('清除')
			localStorage.clear();
		},

		
	},
	watch: {


	}
}
</script>