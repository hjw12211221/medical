<template lang="jade">
#comboHome
	.flex.px3.py2.handle-border-bottom.lh_h30.header-color
		.font(onclick="window.history.go(-1)") &#xe61f;
		router-link.flex-max.relative(to='/search')
			input.w10.input-lg.f4(placeholder="机构/套餐" disabled= "true " style='height:30px;border: 1px solid #eee;')
			font.input-search(style='margin-top:-10px') &#xe650;
	.flex.lh_h40.text-center
		.w3.handle-border-right(@click='toggle(1)', :class="{'primary':index===1}") {{cityName}}
			span.font.gray.ml1(v-if='index!==1') &#xe610;
			span.font.primary.ml1(v-if='index===1') &#xe626;
		.w3.omit.handle-border-right(@click='toggle(2)', :class="{'primary':index===2}") {{typeName}} 
			span.font.gray.ml1(v-if='index!==2') &#xe610;
			span.font.primary.ml1(v-if='index===2') &#xe626;
		.w3.omit.handle-border-right(@click='toggle(3)', :class="{'primary':index===3}") {{diseaseName}}
			span.font.gray.ml1(v-if='index!==3') &#xe610;
			span.font.primary.ml1(v-if='index===3') &#xe626;
		.w2(@click='toggle(4)', :class="{'primary':index===4}") 筛选
			span.font.gray.ml1(v-if='index!==4') &#xe610;
			span.font.primary.ml1(v-if='index===4') &#xe626;
	.main(style="top:90px;bottom:0", v-scrollLoad:scrolldown='nextPage', ref="main")
		.flex.align-center.w10.py2.handle-border-top(v-for='(combo,index) in comboList' ,:key="index",@click="jumpTo(combo.id)")
			.flex-max.pl3.omit(style='margin-right:5px')
				.f4 {{combo.comboName}}
				.f4.red.my2 {{combo.preferentPrice}}元 {{combo.discount | discount}}
					span.ml2.f5.gray 原价 {{combo.realPrice}}元 预约量 {{combo.comboOrderCount+combo.realOrderCount}}
				.f5.gray 体检机构: {{combo.orgName}}
				.gray.omit.font.my2 &#xe669; 
					span.f5 {{combo.address}}
				div(style='')
					span.inline-block.mr2.lh_h25.round.px1.border( v-for='(type,index) in combo.typeList',:style="{borderColor:colors[index],color:colors[index]}" v-if='index<3') {{type.typeName}} 
			.font.gray.mr3 &#xe625;
		.notMore(v-if="isMore" ) 没有更多内容啦
		.notMore(v-if="isMore==false" ) 加载中...
	.mask.handle-border-top( v-if='isMask' @click='isMask=false;index=0' style='position:fixed;top:90px;')
		.flex.text-center( style='height:200px;' @click='stopP' v-if="index===1")
			.bg-white.w4.overflow-y(v-if='cityList.length>0')
				.py2.bg( v-for='(city,index) in cityList' ,:key="index" @click='optionChild(city,index)',:class="{'bg-white':childCity[0].cityId==city.cityId}") {{city.cityName}}
			.flex-max.bg-white.overflow-y(v-if='childCity.length>0'  @click='stopP')
				.py2( v-for='(child,index) in childCity' key="child" @click='Option(child,index)',:class="{'primary':cityName==child.regionName}") {{child.regionName}}		
		.bg-white.text-center.overflow-y(v-if='index===2' style='max-height:50%;')
			.py2( v-for='(type,index) in orgType' @click='Option(type,index)',:class="{'primary':typeName==type.typeName}") {{type.typeName}}
		.bg-white.text-center.overflow-y(v-if='index===3' style='max-height:50%;')
			.py2( v-for='(disease,index) in diseaseList' @click='Option(disease,index)',:class="{'primary':diseaseName===disease.diseaseName}") {{disease.diseaseName}}
		.bg-white(v-if='index===4' @click='stopP')
			.pb3.px3
				.pt2.pb1 性别
				div
					span.inline-block.px2.lh_h20.mr2.mb1(v-for="(sex,index) in sexList" ,:class="{'activity':sexId===sex.Id}" @click="sexId=sex.Id") {{sex.Name}}
				.pt2.pb1 婚姻状态
				div 
					span.inline-block.px2.lh_h20.mr2.mb1(v-for="(marriage,index) in marriageList" ,:class="{'activity':marriageId===marriage.Id}" @click="marriageId=marriage.Id") {{marriage.Name}}
				.pt2.pb1 价格
				div
					span.inline-block.px2.lh_h20.mr2.mb1(v-for="(price,index) in priceList" ,:class="{'activity':priceId===price.Id}" @click="priceId=price.Id;startPrice=price.startPrice;endPrice=price.endPrice;") {{price.name}}
				.btn-block(style='margin-top:30px' @click='screen') 确认
	router-view
	modal-load(:isModal ='loadIsModal')
	modal-hint(:isShow='hintIsModal',:content='hint')
	
</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalLoad from '../../component/modalLoad.vue'
import modalHint from '../../component/modalHint.vue'
export default {
	components: {
		modalLoad,
		modalHint
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			loadIsModal:true,
			isMask:false,
			index:0, 
			pageNo:1,
			pages:'',
			cityName:'选择地区',
			gbDistrictCode:'',
			typeName:'体检类型',
			typeId:'',
			diseaseName:'高发疾病',
			diseaseId:'',
			sexList:[{Id: '',Name:'全部'},{Id: '1',Name:'男'},{Id: '2',Name:'女'}],
			sexId:'',
			marriageList:[{Id: '',Name:'全部'},{Id: 1,Name:'已婚'},{Id: 0,Name:'未婚'}],
			marriageId:'',
			priceList:[{Id:'',startPrice:'',endPrice:'',name:'全部'},{Id: 1,startPrice:0,endPrice:300,name:'300元以下'},{Id: 2,startPrice:300,endPrice:500,name:'300~500元'},{Id: 3,startPrice:500,endPrice:800,name:'500~800元'},{Id: 4,startPrice:800,endPrice:1500,name:'800~1500元'},{Id: 5,startPrice:1500,endPrice:3000,name:'1500~3000元'},{Id: 6,startPrice:3000,endPrice:'',name:'3000元以上'}],
			priceId:'',
			startPrice:'',
			endPrice:'',
			cityList:[],//地区列表
			childCity:[],
			cityId:'',
			orgType:[],//机构类型
			diseaseList:[],//高发疾病
			comboList:[],
			colors:['#F9C738','#67C6FF','#92D66F'],
			isMore:false,
			comboId: 0
		}
	},
	mounted(){
		this.areaGet(),//获得地区列表
		this.diseaseGet()
		this.selectCity({areaCode:"330100"})
	},
	methods:{
		initData:function (obj) {
			util.setTitle('选择套餐')
			bookApi('ddyy.medical.combo.find.list',obj).then((res) => {
				// console.log(obj)
				if(res.data.code==0){
					this.pages=res.data.obj.pages
					if(this.pages<2){
						this.isMore=true
					}else{
						this.isMore=false
					}					
					if(this.pageNo==1){
							this.comboList=res.data.obj.list
					}else{
						this.comboList=[...this.comboList,...res.data.obj.list]
					}
				}else {
					util.hintIsModal(res.data.msg,this)
				}
				// 分享
				var share={title:this.typeName+"-点点医生体检预约",desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
				util.jssdk(share)
				this.loadIsModal=false
			})
			// console.log(this.isMore)
		},
		// 阻止冒泡
		stopP:function () {
			util.stopPropagation()
		},
		// 获取地区列表
		areaGet:function (code) {
			bookApi('ddys.medical.area.citylist').then((res) => {
				if(res.data.code==0){
					this.cityList=res.data.list
					this.childCity=res.data.list[0].regionList
					this.cityId=res.data.list[0].cityId
				}else {
        	util.hintIsModal(res.data.msg,this)
				}
			})		
		},
		// 选择地区
		optionChild:function (val, idx) {
			this.childCity=this.cityList[idx].regionList
			this.cityId=this.cityList[idx].cityId
		},
		diseaseGet:function(){
			bookApi('ddyy.medical.recommend.list',{pageSize:100}).then((res) => {
				if(res.data.code==0){
					res.data.diseaseList.list.unshift({diseaseName:'全部',id:''})
					res.data.mTypeList.list.unshift({typeName:'全部',id:''})
						this.diseaseList=res.data.diseaseList.list
						this.orgType=res.data.mTypeList.list
						if(util.getQstr('typeId')){
							for(var i=0;i<this.orgType.length;i++){
								if(this.orgType[i].id===Number(util.getQstr('typeId'))){
									this.typeName =this.orgType[i].typeName
								}
							}
							this.typeId=Number(util.getQstr('typeId'))
							this.initData({
								gbCityCode:this.cityId,
								gbDistrictCode:this.gbDistrictCode,
								typeId:Number(util.getQstr('typeId')),
								diseaseId:this.diseaseId,
								comboSex:this.sexId,
								marriageStatus:this.marriageId,
								startPrice:this.startPrice,
								endPrice:this.endPrice
							})
						}else{
							this.initData()
						}
					}else {
						util.hintIsModal(res.data.msg,this)
					}
			})
		},
		// 条件筛选
		Option:function (val,idx) {
			this.pageNo=1
			this.comboList=[]
			// 筛选地区
			if(this.index===1){
				this.cityName=val.regionName;
				//地区代码
				this.gbDistrictCode=val.regionId
			}
			// 机构类型选择
			else if(this.index===2){
				//类型名
				this.typeName=val.typeName
				this.typeId=val.id
				// 分享
				var share={title:(this.typeName=='体检类型'?'全部体检':this.typeName)+"-点点医生体检预约",desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
				util.jssdk(share)
			}
			//高发疾病选择
			else if(this.index===3){
				this.diseaseName=val.diseaseName
				this.diseaseId=val.id
			}
			
			this.initData({
				gbCityCode:this.cityId,
				gbDistrictCode:this.gbDistrictCode,
				typeId:this.typeId,
				diseaseId:this.diseaseId,
				comboSex:this.sexId,
				marriageStatus:this.marriageId,
				startPrice:this.startPrice,
				endPrice:this.endPrice,
				pageNo:this.pageNo
			})
			this.isMask=false
			this.index=0
		},
		//选择城市名
		selectCity(val,idx){
			var cityCode=val.areaCode
			if(val.areaCode!="330100"){
				this.citySelectName=''
			}
			this.cityChildName=val.areaName
			this.areaGet(cityCode) 
		},		
		// 细节筛选
		screen:function () {
			this.pageNo=1
			this.comboList=[]
			this.initData({
				gbCityCode:this.cityId,
				gbDistrictCode:this.gbDistrictCode,
				typeId:this.typeId,
				diseaseId:this.diseaseId,
				comboSex:this.sexId,
				marriageStatus:this.marriageId,
				startPrice:this.startPrice,
				endPrice:this.endPrice,
				pageNo:this.pageNo
			})
			this.isMask=false
			this.index=0
		},
		jumpTo:function(val){
			this.$router.push(`/comboDetails/${val}`)
			this.comboId = val
		},
		nextPage:function () {
			if(this.pageNo<this.pages){
				this.loadIsModal=true
				this.pageNo++
				this.initData({
					gbCityCode:this.cityId,
					gbDistrictCode:this.gbDistrictCode,
					typeId:this.typeId,
					diseaseId:this.diseaseId,
					comboSex:this.sexId,
					marriageStatus:this.marriageId,
					startPrice:this.startPrice,
					endPrice:this.endPrice,
					pageNo:this.pageNo
			})
			}else if(this.pageNo==this.pages){
				this.isMore=true
				// util.hintIsModal('没有更多了',this)
			}
		},
		// 模态框切换
		toggle:function (num) {
			if(this.index==num){
				this.isMask=false
				this.index=0
			}else{
				this.index=num
				this.isMask=true
				document.getElementsByClassName('main')[0].style.overflow='hidden'
			}
			
		}
	},
	watch: {
		'isMask'(val){
				if(val==false){
					document.getElementsByClassName('main')[0].style.overflow='auto'
				}
		},
		'$route'(to, from){
			if (from.path == `/comboDetails/${this.comboId}`) {
				this.initData({
					gbCityCode:this.cityId,
					gbDistrictCode:this.gbDistrictCode,
					typeId:this.typeId,
					diseaseId:this.diseaseId,
					comboSex:this.sexId,
					marriageStatus:this.marriageId,
					startPrice:this.startPrice,
					endPrice:this.endPrice,
					pageNo:this.pageNo
				})
				if (sessionStorage.getItem('comScrollTop')) {
					this.$refs.main.scrollTop = sessionStorage.getItem('comScrollTop')
				}
			}
		}
	},
	beforeRouteLeave (to, from, next) {
	sessionStorage.setItem('comScrollTop', this.$refs.main.scrollTop)
	next()
	}
}
</script>
<style lang="stylus" scoped>
.activity
	/*border:0px solid #ffa052!important;*/
	color #ffa052
	background-color #fff!important
	box-sizing border-box
	-moz-box-sizing  border-box /* Firefox */
	-webkit-box-sizing border-box /* Safari */
/*没有更多*/

.popover-border
	border-top 1px solid #DDDDDD
.header-color
	background #F1F1F1
	.input-lg
		background #fff
.mask
	position absolute
</style>