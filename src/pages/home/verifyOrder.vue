<template lang="jade">
#verifyOrder
	.bg-fixed
	.bg-white.mb2.px3
		.py2.border-bottom.gray 体检机构信息
		.py2.omit 机构: {{comboObj.orgName}}
		.pb2.omit 套餐: {{comboObj.comboName}}
	.bg-white.mb2.px3
		.py2.border-bottom.gray 选择体检人
		.flex.align-center(@click='modalList=true')
			.flex-max
				.py2 姓名: {{patientName}}
				.pb2 身份证: {{patientCardNo}}
			.font.gray &#xe625;
	.bg-white.mb2.px3
		.py2.border-bottom.gray 选择体检日期 (至少提前{{comboObj.schDate}}天)
		.flex.align-center
			.flex-max.py2 
				.flex.align-center
					.f3.mr3 日期: 
					date-picker(:date="date",:option="option",:limit="limit",@change='getValue')
	.btn-block(style='margin-top:40px' @click='submit') 提交
	.mask(v-if="modalList==true" @click='modalList=false')
		.modalList(@click='stopP')
			.text-center.overflow-y(style='position: absolute;z-index: 1000;bottom: 0;left: 0;width: 100%;background: #fff;max-height:50%')
				.py4.bg-white
					.py1.my1.w8.mx-auto.border(@click="listOption(index)",v-for="(x,index) in list",:class="{'border-primary':border==index}") {{x.patientName}}
					.py1.my1.w8.mx-auto.border(
						@click='addPatient'
					) + &nbsp;添加体检人
	modal-hint(:isShow='hintIsModal',:content='hint')
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalHint from '../../component/modalHint.vue'
import datePicker from 'vue-datepicker/vue-datepicker-es6.vue'
import config from '../../utils/config.js'
export default {
	components: {
		 modalHint,
		 datePicker
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			list:[],
			value:'',
			modalList:false,
			border:0,
			patientName:'',
			patientCardNo:'',
			comboObj:'',
			date: {
				time: ''
			},
      option: {
    	 type: 'min',
    	 week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    	 month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    	 format: '', // YYYY-MM-DD 日期
    	 inputStyle: {               // input 样式
        'display': 'inline-block',
        'padding': '6px',
        'line-height': '22px',
        'width':'150px',
        'font-size': '16px',
        'border': '1px solid #eee',
        'border-radius': '2px',
        'color': '#5F5F5F',
        'margin':'0',
        'background': "url('http://www.wowys.com/static/ddysVuePic/logo.png') no-repeat 5px",
        'background-size': '20px 20px',
        'text-indent': '30px'
        },
         color: {                // 字体颜色
          header: '#fff',    // 头部
          headerText: '#333',   // 头部文案 
        },
        buttons: {              // button 文案
          ok: '确定',
          cancel: '取消'
        },
      },
      limit: [
      {
	      type: 'weekday',
	      available: [1, 2, 3, 4, 5,6,0]
	     },
	     {
        type: 'fromto',
        from: '',
        to: '2100-01-01'
    	}]
		}
	},
	mounted(){
		this.limit[1].from = util.formatDate(new Date())
		this.date.time = util.formatDate(new Date(new Date().setDate(new Date().getDate()+1)))
		this.value = this.date.time
		this.initData()
		this.getPat()
	},
	methods:{
		initData:function () {
			window.timer=setInterval(util.runToLogin(this,this.getPat),100)
			util.setTitle('确认订单')
			bookApi('ddyy.medical.combo.detail',{id:this.$route.params.id}).then((res) => {
				if(res.data.code==0){
						this.comboObj=res.data.obj
					}else {
						util.hintIsModal(res.data.msg,this)
					}
			})

		},
		runToLogin:function () {
			var user=util.getVal('userInfo')  
			if(user==''||user==null){
					util.isLogin(location.href,this.getPat)
					clearInterval(timer)
				}else{
					this.getPat()
					setTimeout(()=>{
							clearInterval(timer)
						},200)
				}  
		},
		getPat:function () {
			bookApi('ddyy.medical.pat.list.v2',{
				bookPatId:util.getVal('userInfo').patientId
			}).then((res)=>{
				if(res.data.code==0){
					this.list=res.data.obj.list
					this.patientName=this.list[0].patientName
					this.patientCardNo=this.list[0].patientCardNo
				}else {
					util.hintIsModal(res.data.msg,this)
				}
			})
		},
		submit:function(){
			let weChat = util.getVal('weChat')
			if (!weChat) {
				util.initData()
				return false
			}
			if (sessionStorage.getItem('channel')) {
				config.basePostData.channel = sessionStorage.getItem('channel')
			}
			bookApi('ddyy.medical.order.commit',{
				orgId:this.comboObj.orgId,
				orgName:this.comboObj.orgName,
				bookPatId:util.getVal('userInfo').patientId,
				visitPatId:this.list[this.border].patId,
				medicalPerson:this.list[this.border].patientName,
				medicalTel:this.list[this.border].patientMobile,
				medicalIdcard:this.list[this.border].patientCardNo,
				medicalDate:this.value,
				comboId:this.comboObj.id,
				comboName:this.comboObj.comboName,
				openid: weChat ? weChat.openid : ''
			}).then((res) => {
				if(res.data.code==0){
					var url=window.location.href;
					if(url.indexOf('?')<0||url.indexOf('?')>url.indexOf('#')){
						var index=url.indexOf('#');
						url=url.substring(0,index)
							window.location.href=url+'?type=TJYY#/pay/'+res.data.obj.orderId+'/'+res.data.obj.bookPatId
						// this.$router.push({path:'/pay/'+res.data.obj.orderId+'/'+res.data.obj.bookPatId})
					}else{
						this.$router.push({path:'/pay/'+res.data.obj.orderId+'/'+res.data.obj.bookPatId})
					}
					localStorage.removeItem(util.name+"coupon");
				}else {
					util.hintIsModal(res.data.msg,this)
				}
			})
		},
		getValue:function (data) {
			this.value=data;
			console.log(this.value)
		},
		showCalendar:function(e){
			e.stopPropagation();
			var that=this;
			that.show=true;
			that.x=e.target.offsetLeft;
			that.y=e.target.offsetTop+e.target.offsetHeight+8;
			var bindHide=function(e){
				e.stopPropagation();
				that.show=false;
				document.removeEventListener('click',bindHide,false);
			};
			setTimeout(function(){
				document.addEventListener('click',bindHide,false);
			},500);
		},
		stopP:function(){
			util.stopPropagation()
		},
		listOption:function(index){
			event.stopPropagation()
			this.modalList=false
			this.border=index
			this.patientName=this.list[index].patientName
			this.patientCardNo=this.list[index].patientCardNo
		},
		addPatient:function(){
			util.setVal('addPatient',window.location.href)
			this.$router.push({path:'/addPatient'})
		},
	},
	watch: {
		'$route' (to, from) {

		}

	}
}
</script>