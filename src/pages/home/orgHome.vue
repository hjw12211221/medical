<template lang="jade">
#orgHome
	.flex.px3.py2.border-bottom.lh_h30
		.font(onclick="window.history.go(-1)") &#xe61f;
		router-link.flex-max.relative(to='/search')
			input.w10.input-lg.f4(placeholder="机构/套餐" disabled= "true " style='height:30px;border: 1px solid #eee;')
			font.input-search(style='margin-top:-10px') &#xe650;
	.flex.lh_h40.text-center
		.w34(@click='toggle(1)', :class="{'primary':index===1}") {{cityName}}
			span.font.gray.ml1(v-if='index!==1') &#xe610;
			span.font.primary.ml1(v-if='index===1') &#xe626;
		.w34.omit(@click='toggle(2)', :class="{'primary':index===2}") {{typeName}}
			span.font.gray.ml1(v-if='index!==2') &#xe610;
			span.font.primary.ml1(v-if='index===2') &#xe626;
		.w34(@click='toggle(3)', :class="{'primary':index===3}") {{sortName}}
			span.font.gray.ml1(v-if='index!==3') &#xe610;
			span.font.primary.ml1(v-if='index===3') &#xe626;
	.main(style="top:90px;bottom:0" v-scrollLoad:scrolldown='nextPage' ref="main")
		.flex.w10.py3.border-brother-top(v-for='(org,index) in orgList' ,:key="index" @click='orgJump(org)')
			.relative.ml3
				img.block(:src='org.orgIndexPic' onerror="this.src='http://ddys-back.diandianys.com/static/org/orgDefault.png'" width='110px' height='75px')
				.absolute.left0.w10.bottom0.text-center.f5.white(style='height:20px;line-height:20px;background:rgba(255,125,19,0.8)') {{org.typeName}}
			.flex-max.mx3.omit
				.omit.mr2.f4 {{org.orgName}}
				.dark.my2 {{org.comboNum}}项套餐
					span.mx3 {{org.orgOrderCount + org.realOrderCount}}人预约
				.gray.f5.omit.font &#xe669;  {{org.address}}
		.notMore(v-if="isMore" style="margin-top:-10px;") 没有更多内容啦
		.notMore(v-if="isMore==false" style="margin-top:-10px;") 加载中...
	.mask.handle-border-top(style='top:90px' v-if='isMask' @click='isMask=false;index=0')
		.flex.text-center( style='max-height:200px;' @click='stopP' v-if="index===1")
			.bg-white.w4.overflow-y(v-if='cityList.length>0')
				.py2.bg( v-for='(city,index) in cityList' ,:key="index" @click='optionChild(city,index)',:class="{'bg-white':childCity[0].cityId==city.cityId}") {{city.cityName}}
			.flex-max.bg-white.overflow-y(v-if='childCity.length>0'  @click='stopP')
				.py2( v-for='(child,index) in childCity' ,:key="index" @click='Option(child,index)',:class="{'primary':cityName==child.regionName}") {{child.regionName}}
		.bg-white.text-center(v-if='index===2')
			.py2( v-for='(type,index) in orgType',:key="index" @click='Option(type,index)',:class="{'primary':typeName==type.typeName}") {{type.typeName}}
		.bg-white.text-center(v-if='index===3')
			.py2( v-for='(sort,index) in sortWay' ,:key="index" @click='Option(sort,index)',:class="{'primary':sortName==sort.sortName}") {{sort.sortName}}
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
			isMore:false,
			index:0,
			pageNo:1,
			pages:'',
			cityName:'所在地区',
			gbDistrictCode:'',
			typeName:'选择机构',
			typeId:'',
			sortName:'默认推荐',
			sortId:'1',
			cityList:[],//地区列表
			childCity:[],
			cityId:'',
			orgType:[
				{typeId: 0,typeName:'全部'},
				{typeId: 1,typeName:'专业体检机构'},
				{typeId: 2,typeName:'公立医院'}
			],//机构类型
			sortWay:[
				{sortId: '1',sortName:'默认推荐'},
				{sortId: '2',sortName:'按距离近'},
				{sortId: '3',sortName:'按预约量'}
			],//排序规则
			orgLng:'',
			orgLat:'',
			orgList:[],//机构列表
			scroll: 0,
			organizationId: 0
		}
	},
	mounted(){
		this.initData({sortWay: '1',pageNo: 1}),
		this.areaGet()
		var share={title:"全部机构-点点医生体检预约",desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
		util.jssdk(share)
	},
	methods:{
		// 机构列表API请求
		initData:function (obj) {
			util.setTitle('选择机构')
			bookApi('ddyy.medical.org.list',obj).then((res) => {
				if(res.data.code==0){
						this.pages=res.data.obj.pages
						if(this.pageNo==1){
		          this.orgList=res.data.obj.list
		        }else{
		          this.orgList=[...this.orgList,...res.data.obj.list]
		        }
					}else {
						util.hintIsModal(res.data.msg,this)
					}
					this.loadIsModal=false
			})
		},
		// 阻止冒泡
		stopP:function () {
			util.stopPropagation()
		},
		// 获取地区列表
		areaGet:function () {
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
		// 跳转下个页面
		jumpTo:function(val){

		},
		// 条件筛选
		Option:function (val,idx) {
			this.pageNo=1
			this.orgList=[]
			// 筛选地区
			if(this.index===1){
				this.cityName=val.regionName;
				this.gbDistrictCode=val.regionId
				this.initData({gbCityCode:this.cityId,gbDistrictCode:this.gbDistrictCode,orgType:this.typeId,sortWay:this.sortId,orgLng:this.orgLng,orgLat:this.orgLat})
			}
			// 机构类型选择
			else if(this.index===2){
				this.typeName=val.typeName
				this.typeId=val.typeId
				this.initData({gbCityCode:this.cityId,gbDistrictCode:this.gbDistrictCode,orgType:this.typeId,sortWay:this.sortId,orgLng:this.orgLng,orgLat:this.orgLat})
				var share={title:this.typeName+"-点点医生体检预约",desc:"1分钟预约，5折起，省时省钱",imgUrl:"http://www.wowys.com/static/ddysVuePic/logo.png",link:location.href}
				util.jssdk(share)
			}
			// 排序规则
			else if(this.index===3){
				this.sortName=val.sortName
				this.sortId=val.sortId
				if(val.sortId==2){
					bookApi('ddyy.system.wechat.jsapiticket.get',{
				    appid:util.wxid,
				    reqUrl:window.location.href
				  },'1').then((res)=>{
						var config=res.data.obj
						// config.debug=true
						wx.config(config);
						wx.ready(()=>{
							var _this=this
							wx.getLocation({
							    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							    success: function(res) {
							    	console.log('成功')
						        _this.orgLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						        _this.orgLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						        // var speed = res.speed; // 速度，以米/每秒计
						        // var accuracy = res.accuracy; // 位置精度
						        _this.initData({gbCityCode:this.cityId,gbDistrictCode:_this.gbDistrictCode,orgType:_this.typeId,sortWay:_this.sortId,orgLng:res.longitude,orgLat:res.latitude})
							    }
							});

						});
						wx.error(function(res){
							// alert('失败')
						    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
						});
				  })

				}else{
					this.initData({gbCityCode:this.cityId,gbDistrictCode:this.gbDistrictCode,orgType:this.typeId,sortWay:this.sortId,orgLng:this.orgLng,orgLat:this.orgLat})
				}
			}
			this.isMask=false
			this.index=0
		},
		orgJump:function(val){
			if(this.$route.query.from&&this.$route.query.return){
				util.setVal('orgName',val.orgName)
				this.$router.push({path:'/team',query:{'redirect':'org_details','return':1}})
				return
			}else{
				this.organizationId = val.id
				this.$router.push({path:'/orgDetails/'+val.id})
			}
		},
		// 滚动显示更多页面
		nextPage:function () {
			if(this.pageNo<this.pages){
				this.loadIsModal=true
				this.pageNo++
				this.initData({gbCityCode:this.cityId,gbDistrictCode:this.gbDistrictCode,orgType:this.typeId,sortWay:this.sortId,pageNo:this.pageNo})
			}else if(this.pageNo==this.pages){
        this.isMore=true
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
			if (from.path == `/orgDetails/${this.organizationId}`) {
				this.initData({gbCityCode:this.cityId,gbDistrictCode:this.gbDistrictCode,orgType:this.typeId,sortWay:this.sortId,pageNo:this.pageNo})
				if (sessionStorage.getItem('orgScrollTop')) {
					this.$refs.main.scrollTop = sessionStorage.getItem('orgScrollTop')
				}
			}
		}
	},
	beforeRouteLeave (to, from, next) {
		sessionStorage.setItem('orgScrollTop', this.$refs.main.scrollTop)
		next()
	}
}
</script>
<style lang='stylus' scoped>
	.mask
		position absolute
/*	.flex.lh_h40.text-center
		@media screen and (max-width 320px){
			font-size 14px
		}
*/
</style>