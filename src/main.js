import Vue from 'vue'
import App from './app.vue'
import router from './router/index.js'
import init from './utils/init.js'
import scrollLoad from './utils/directives/scrollLoad.js'
import touch from './utils/directives/touch.js'
import util from './utils/util.js'
import config from './utils/config.js'

Vue.filter('discount', function (value) {
	if(value&&value!==1){
		return value=(value*10).toFixed(1)+'折'
	}else{
		return value=''
	}
})
util.getQstr('changeRequest') ? util.basePostData.channel = '25' : util.basePostData.channel = '23'
if(util.getQstr('channel')){
  if (util.getQstr('channel') == 'yhwy') {
    util.basePostData.channel=util.getQstr('channel')
    util.name='yhwy_'
    config.name='yhwy_'
  } 
}
// const head = document.getElementsByTagName('head')[0]
// const script = document.createElement('script')
// script.src = 'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js'
// head.appendChild(script)
// setTimeout(() => {
//     const vConsole = new VConsole();
//     console.log('11')
// }, 500)
const app = new Vue({
  router,
  ...App
}).$mount('#app')
