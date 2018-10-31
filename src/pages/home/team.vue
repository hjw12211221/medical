<template lang="jade">
#team
	.mains(v-show="routerName!='child'")
		img.block(src='../../images/teamBanner.png' @click='removeItem')
		.p3.mb2.bottom_bg.f5
			.mb2 团队体检说明
			p.gray.lh18 5人以上即可预约团体体检，请输入预约信息，会有专业体检顾问为您服务，即可享受医院团体体检内部价。
		.p3.f5 团队预约信息
		.border.w8.mx-auto.mb4(style="border-bottom:none")
			.p2.flex.border-bottom.align-center
				| 联系人:
				input.w10.f4.flex-max.ml3(v-model='contacts')
				.red *
			.p2.flex.border-bottom.align-center
				| 电话:
				input.w10.f4.flex-max.ml3(type='number' v-model='medicalTel')
				.red *
			.p2.flex.border-bottom.font 
				| 选择体检机构:
				.tap-highlight.w10.f4.flex-max.ml3.omit( @click='selectOrg' ) {{orgName}}
				span(style='color:#c7c4c4;position: relative;top: 3px;') &#xe625;
			.p2.border-bottom
				.flex.align-center
					span.flex-max(style='paddingRight:5px;lineHeight:30px;') 体检日期:
					date-picker(:date="date",:option="option",:limit="limit",@change='getValue')
			.p2.flex.border-bottom
				| 体检预算:
				input.w10.f4.flex-max.ml3(type='number', v-model='unitPrice' @input="onInput")
			.p2.flex.border-bottom.align-center
				| 单位名称:
				input.w10.f4.flex-max.ml3(v-model='contactUnit')
				.red *
			.p2.flex.border-bottom.align-center
				| 体检人数:
				input.w10.f4.flex-max.ml3(type='number',v-model='medicalCount')
				.red *
			.p2.border-bottom
				| 其它需求:
				textarea.w10.f4(style="resize: none;height:4em;",v-model='remark')
			//- .fixed.w10.left0.bottom0.text-center.bg-white(style="height:50px;")
			//- 	a.floatl.inline-block.w4.gray(:href="'tel:0571-85890223'")
			//- 		.font.mt1(style="font-size:20px") &#xe616;
			//- 		.f5 咨询客服 
			//- 	.floatl.inline-block.w6.bg-primary.white.f3(style='line-height:50px', @click='submit') 提 交
		.w10.left0.bottom0.right0.text-center.flex.fixed(style="height:50px")
			a.w3.gray(style='min-width:130px;background:#fff;',:href="'tel:0571-85890223'")
				.font.mt1(style="font-size:20px") &#xe616;
				.f5 咨询客服 
			.flex-max.bg-primary.white.f3(style='line-height:50px' @click='submit') 提 交
	modal-hint(:isShow='hintIsModal',:content='hint')
	router-view
</template>
<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalHint from '../../component/modalHint.vue'
import datePicker from 'vue-datepicker/vue-datepicker-es6.vue'
export default {
	components: {
		modalHint,
		datePicker
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			bookPatId:'',
			contacts:'',
			medicalTel:'',
			contactUnit:'',
			medicalCount:'',
			medicalDate:'',
			orgName:'',
			unitPrice:'',
			remark:'',
			routerName:'',
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
	activated () {
		if(this.$route.query.redirect&&this.$route.query.return){
			this.orgName=util.getVal('orgName')
			this.contacts=util.getVal('contacts')
			this.medicalTel=util.getVal('medicalTel')
			this.medicalDate=util.getVal('medicalDate')
			this.unitPrice=util.getVal('unitPrice')
			this.contactUnit=util.getVal('contactUnit')
			this.medicalCount=util.getVal('medicalCount')
			this.remark=util.getVal('remark')
		}
	},
	mounted(){
		this.limit[1].from = util.formatDate(new Date())
		this.date.time = util.formatDate(new Date(new Date().setDate(new Date().getDate()+1)))
		this.medicalDate = this.date.time
		// localStorage.userContent={'contacts':'','medicalTel':'','unitPrice':'','contactUnit':'','medicalCount':'','remark':''}
		this.initData()
		if(this.$route.query.redirect&&this.$route.query.return){
			this.orgName=util.getVal('orgName')
			this.contacts=util.getVal('contacts')
			this.medicalTel=util.getVal('medicalTel')
			this.medicalDate=util.getVal('medicalDate')
			this.unitPrice=util.getVal('unitPrice')
			this.contactUnit=util.getVal('contactUnit')
			this.medicalCount=util.getVal('medicalCount')
			this.remark=util.getVal('remark')
		}else{
				// util.setVal('contacts','')
				// util.setVal('orgName','')
				// util.setVal('medicalTel','')
				// util.setVal('medicalCount','')
				// util.setVal('unitPrice','')
				// util.setVal('contactUnit','')
				// util.setVal('remark','')
				// util.setVal('medicalDate','')
		}
		var inputs=document.getElementsByTagName('input');
		var element=document.getElementsByClassName('element')[0]
		// console.log(element.style);
		// for(var i=0,length=inputs.length;i<length;i++){
		// 	inputs[i].onfocus=function(){
		// 		element.style.position='relative'
		// 	}
		// 	inputs[i].onblur=function(){
		// 		element.style.position='fixed'
		// 	}				
		// }
	},
	methods:{
		initData:function () {
			if(this.$route.query.from){
				this.routerName='child'
			}else{
				this.routerName=''
			}
			util.setTitle('团队')
			var user=util.getVal('userInfo')  
			if(user==''||user==null){//判断是否登录
				util.runToLogin(this)
			}else{
				this.bookPatId=util.getVal('userInfo').patientId
			}
		},
		onInput () {
			if (this.unitPrice.length>8) {
				this.unitPrice = this.unitPrice.slice(0,8)
			}
		},
		removeItem:function(){
			localStorage.clear();
		},
		getValue:function (data) {
			// if(this.$route.query.redirect){
			// 		// console.log(this.$router);
			// 	util.setVal('medicalDate',util.getVal('medicalDate'))
			// }
			this.medicalDate = data;
		},
		submit:function () {
			var _this=this
			if(this.contacts!=''&&this.medicalTel.length==11&&this.contactUnit!=''&&this.medicalCount!=''){
				bookApi('ddyy.medical.order.team.commit',{
					bookPatId:this.bookPatId,
					contacts:this.contacts,
					medicalTel:this.medicalTel,
					contactUnit:this.contactUnit,
					medicalCount:this.medicalCount,
					medicalDate:this.medicalDate,
					orgName:this.orgName,
					unitPrice:this.unitPrice,
					remark:this.remark
				}).then((res) => {
					if(res.data.code==0){
						util.setVal('contacts','')
						util.setVal('orgName','')
						util.setVal('medicalTel','')
						util.setVal('medicalCount','')
						util.setVal('unitPrice','')
						util.setVal('contactUnit','')
						util.setVal('remark','')
						util.setVal('medicalDate','')
						util.hintIsModal('预约成功',_this)
						setTimeout(()=>{
							this.$router.push({path:'/home'})
						},2000)
					}else{
						util.hintIsModal(res.data.msg,_this)
					}
				})
			}else if(this.contacts==''){
				util.hintIsModal('请填写联系人',_this)
			}else if(this.medicalTel==''){
				util.hintIsModal('请填写手机号',_this)
			}else if(!(/^1[34578]\d{9}$/.test(this.medicalTel))){
					util.hintIsModal('请正确的手机号码输入',_this)
			}
			else if(this.contactUnit==''){
				util.hintIsModal('请填写单位名称',_this)
			}else if(this.medicalCount==''){
				util.hintIsModal('请填写体检人数',_this)
			}else if(this.medicalTel.length<11){
				util.hintIsModal('手机号格式有误',_this)
			}else{
				util.hintIsModal('未知错误',_this)
			}
		},
		selectOrg:function(){
			util.setVal('contacts',this.contacts)
			util.setVal('medicalTel',this.medicalTel)
			util.setVal('medicalDate',this.medicalDate)
			util.setVal('orgName',this.orgName)
			util.setVal('unitPrice',this.unitPrice)
			util.setVal('contactUnit',this.contactUnit)
			util.setVal('medicalCount',this.medicalCount)
			util.setVal('remark',this.remark)
			// this.$router.push({path:'/orgHome',query:{from:'team',return:1}})
			this.$router.push({path:'/team/orgHome',query:{from:'team',return:1}})
		},
	},
	watch: {
		'$route' (to, from) {
		//刷新参数放到这里里面去触发就可以刷新相同界面了
			if(to.query.from){
				this.routerName='child'	
			}else{
				this.routerName=''
			}
			if(to.query.redirect){
				util.setTitle('团队')
				this.orgName=util.getVal('orgName')
			}
		},
		// 'contacts'(val){
		// 	util.setVal('contacts',val)
		// },
		// 'medicalTel'(val){
		// 	util.setVal('medicalTel',val)
		// },
		// 'medicalTel'(val){
		// 	util.setVal('medicalTel',val)
		// },
		// 'unitPrice'(val){
		// 	util.setVal('unitPrice',val)
		// },
		// 'contactUnit'(val){
		// 	util.setVal('contactUnit',val)
		// },
		// 'medicalCount'(val){
		// 	util.setVal('medicalCount',val)
		// },
		// 'remark'(val){
		// 	util.setVal('remark',val)
		// },				
	}
}
</script>
<style lang='stylus' scoped>
.mains
	padding-bottom 50px
.element
	bottom 0
</style>