import Vue from 'vue'
Vue.directive('scrollLoad', {
	bind: function(el, binding){
		el.onscroll=function () {
			var elclientHeight=el.clientHeight  //el的可视高度 627
			var elscrollHeight=el.scrollHeight //el的全部高度  997
			var elScrollTop=el.scrollTop  //el的滚动高度  370
			// 如果到底部了
			// console.log('触发我了')
			if(elScrollTop==elscrollHeight-elclientHeight){
				// console.log('快到底了,我要加载更多内容了')
				if(binding.arg === 'scrolldown'){
					binding.value()
				}
			}
		}
	}
})