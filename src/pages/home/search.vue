<template lang="jade">
#search(@click='type=false')
	.bg-fixed
	.flex.px3.bg-white(style="height:48px;")
		.flex-max.relative.my2.bg.overflow(style='border-radius: 15px;')
			input.input-lg.f5.input-bg(
				v-model="key"
				placeholder="搜索机构、套餐",style="height:28px;text-indent:95px;"
			)
			.absolute.top0.primary.px2(style="line-height:28px;height:28px;left:0px;background-color:#FFF2E7;" @click='stopP') 
				| {{searchWay==1?'机构':'套餐'}} 
				span.font &#xe610;
			font.input-search.f4(style='left:70px;top:0;line-height:28px;') &#xe650;
		.px2.primary.f4(
			style="line-height:48px"
			onclick='window.history.go(-1)'
		) 取消
	.fixed.px3(style='margin-top:-10px;z-index:101' v-if="type" )
		.px2.py1.bg-white(@click='option(1)') 机构
		.px2.py1.bg-white(@click='option(2)') 套餐
	.py2.px4.border-bottom.omit(
		v-for="(book,index) in list",:key="index"
		@click="jumpTo(book)"
	)
	.gray.my1.mx3 推荐机构
	.mx3
		router-link.inline-block.mr3.my1.px3.lh_h30.bg-white(style='border-radius:15px' v-for='(org,index) in orgList' ,:key="index" v-if='org.orgShortName' ,:to="'/orgDetails/'+org.id") {{org.orgShortName}}
	.gray.my1.mx3 推荐套餐
	.mx3
		router-link.inline-block.mr3.my1.px3.lh_h30.bg-white(style='border-radius:15px' v-for='(mType,index) in mTypeList' ,:key="index",:to="'/comboHome?typeId='+mType.id") {{mType.typeName}}
	.mask(v-if='list.length>0' style='top:48px;' @click='list=[]')
		.py2.bg-white.border-top.text-center(v-for='(x,index) in list' ,:key="index" @click='jumpTo(x)') {{x.comboName||x.orgName}}
	modal-hint(:isShow='hintIsModal',:content='hint')
</template>


<script>
import bookApi from '../../utils/bookApi.js'
import util from '../../utils/util.js'
import modalHint from '../../component/modalHint.vue'
export default {
	components: {
		modalHint
	},
	data () {
		return {
			hint:'',
			hintIsModal:false,
			key:'',
			orgList:[],
			mTypeList:[],
			list:'',
			type:false,
			searchWay:1,
		}
	},
	mounted(){
		this.initData()
	},
	methods:{
		initData:function () {
			util.setTitle('搜索页')
			bookApi('ddyy.medical.recommend.list',{
				isRecommend:'1'
			}).then((res) => {
				if(res.data.code==0){
						this.orgList=res.data.orgList.list
						this.mTypeList=res.data.mTypeList.list
					}else {
						console.log('error',res.data.msg)
					}
			})
		},
		jumpTo:function(val){
			this.stopP()
			if(this.searchWay===1){
				this.$router.push({path:'/orgDetails/'+val.id})
			}else{
				this.$router.push({path:'/comboDetails/'+val.id})
			}
		},
		stopP:function(){
			this.type=true
			util.stopPropagation()
		},
		option:function(val){
			this.searchWay=val
			this.type=false
			bookApi('ddyy.medical.search', {
				searchWay:this.searchWay,
				searchText:this.key
			}).then((res) => {
				if(res.data.code==0){
					if(this.searchWay===1){
						this.list=res.data.orgList.list
					}else{
						this.list=res.data.comboList.list
					}
				}else {
					console.log('error',res.data.msg)
				}
			})
		}
	},
	watch: {
		key:function (val, oldVal) {
			if(val.length>1){
				bookApi('ddyy.medical.search', {
					searchWay:this.searchWay,
					searchText:val
				}).then((res) => {
					if(res.data.code==0){
						if(this.searchWay===1){
							this.list=res.data.orgList.list
						}else{
							this.list=res.data.comboList.list
						}
					}else {
						console.log('error',res.data.msg)
					}
				})
			}else{
				this.list=[]
			}

		}

	}
}
</script>