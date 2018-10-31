import bookApi from './bookApi.js'
import config from './config.js'
const util= {...config};
util.$=function(el){
  return document.querySelector(el);
}
util.stopP = function() {
  event.stopPropagation()
},
util.orderState=function(number){
  switch(number)
  {
   case '0':
    return '已支付'
    break;
   case '1':
    return '待支付'
    break;
   case '2':
    return '待支付'
    break;
   case '3':
    return '已取消'
    break;
  }
}
util.isLogin=(url,val,cb,parmas)=>{    
  if(util.getQstr(parmas)||util.getQstr('patientId')){
    bookApi('ddyy.book.patient.get.patid',{patientId:util.getQstr(parmas)||util.getQstr('patientId')}).then((res)=>{
      var data=res.data.bookPatient
      // data.patientAge=new Date().getFullYear()-data.patientCardNo.substring(6,10)
      if(data){
        util.setVal('userInfo',data)
      }
      if(val){
        val.userInfo=data
      }
      if(cb){
        cb()
      }
    })
  }else if(!util.getVal('userInfo')){
    var url=encodeURIComponent(url)
    location.replace(util.loginURL + url)
  }else{
    val.userInfo=util.getVal('userInfo')
    if(cb){
        cb()
      }
  }
}
util.runToLogin=(val,cb,parmas)=> {
  util.isLogin(location.href,val,cb,parmas)
  setTimeout(function(){
    if(window.timer){
      clearInterval(timer)
    }
  }.bind(val),200)
}  


util.stopPropagation=function(){
  event.stopPropagation()
},
util.hintIsModal=(msg,val)=>{
  val.loadIsModal=false
  val.hintIsModal=true
  val.hint=msg
  setTimeout(function(){
    val.hintIsModal=false
  }.bind(val),2000)
}
  //设置title

util.setTitle = function(t) {
  document.title = t;
  var i = document.createElement('iframe');
  i.src = '';
  i.style.display = 'none';
  i.onload = function() {
    setTimeout(function(){
      i.remove();
    }, 9)
  }
  document.body.appendChild(i);
}
util.getInfo=function (info) {
  var info=util.name+info
  if(localStorage.getItem(info)==''||localStorage.getItem(info)==null){
    return false
  }else{
    var data = new Function("return" + localStorage.getItem(info))();
    if(info==util.name+'userInfo'){
      data.patientAge=new Date().getFullYear()-data.patientCardNo.substring(6,10)
    }
    console.log('info',data.patientAge)
    return data
  }
}
util.setVal=function (name, value) {
  var db = window.localStorage;
  db.setItem(util.name+name, JSON.stringify(value));
}
util.removeVal=function (name) {
  var db = window.localStorage;
  db.removeItem(util.name+name);
}

util.cardNoAge=function (CardNo) {
  return new Date().getFullYear()-CardNo.substring(6,10)
}
util.strConceal=function (str) {
  if(str.length>7){
    var start=str.substring(0,3)
    var stop=str.substring(str.length-4,str.length)
    var content=str.substring(3,str.length-4)
    var content=content.replace(/./g,"*")
    str=start+content+stop
    return str
  }else{
    return str
  }
}
util.Sex=function (num) {
  if(num==1){
    return '男'
  }else if(num==2){
    return '女'
  }else{
    return ''
  }
}
util.healthCardType=function (type) {
  switch(type)
  {
    case '0':
      return '省医保'
      break;
    case '1':
      return '市医保'
      break;
    case '2':
      return '市民卡'
      break;
    case '3':
      return '农保'
      break;
  }
}
util.trim=function(str){
  str = str.replace(/[\n]/ig,'');
  return str;
}
util.formatDate= function(now,state,type)   {     
  var year=now.getFullYear();     
  var month=now.getMonth()+1;     
  var date=now.getDate();     
  var hour=now.getHours();     
  var minute=now.getMinutes();     
  var second=now.getSeconds(); 
  if(month<10){
    month='0'+month;
  }
  if(date<10){
    date='0'+date;
  }
  if(hour<10){
    hour='0'+hour;
  }
  if(minute<10){
    minute='0'+minute;
  }  
  if(second<10){
    second='0'+second;
  }
  if(state==1){
    return year+"-"+month+"-"+date+" "+hour+":"+minute;
  }else if(state==2){
    return hour+":"+minute
  }else{
    if(type){
      return year+"."+month+"."+date;
    }
    return year+"-"+month+"-"+date;
  }
}
util.week=function(number){
  switch(number)
  {
    case 1:
      return '周一'
      break;
    case 2:
      return '周二'
      break;
    case 3:
      return '周三'
      break;
    case 4:
      return '周四'
      break;
    case 5:
      return '周五'
      break;
    case 6:
      return '周六'
      break;
    default:
      return '周日'
  }
}
// 分享
util.jssdk=function(share){
  var _this=this
  bookApi('ddyy.system.wechat.jsapiticket.get',{
    appid:util.wxid,
    reqUrl:share.link
  },'1').then((res)=>{
    var config=res.data.obj
    // config.debug=true
    wx.config(config); 
    wx.ready(function(){
     
      console.log('成功')
      //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title: share.title, // 分享标题
        link:share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share.imgUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            // alert(share.link)
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
      });
      console.log(share.desc)
      //获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
          title: share.title, // 分享标题
          desc: share.desc, // 分享描述
          link:share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share.imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () { 
              // 用户确认分享后执行的回调函数
              // alert(share.link)
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          }
      });
      // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQQ({
          title: share.title, // 分享标题
          desc: share.desc, // 分享描述
          link:share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share.imgUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
           // 用户取消分享后执行的回调函数
        }
      });
      // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQZone({
          title: share.title, // 分享标题
          desc: share.desc, // 分享描述
          link:share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share.imgUrl, // 分享图标
          success: function () { 
             // 用户确认分享后执行的回调函数
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          }
      });
    })
    wx.error(function(res){
      // util.jssdk(share)
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
  })
}

util.initData=function(){
  if(util.getVal('weChat') && util.getVal('weChat') != null) {
    return
  }else {
    var URI = window.location.href;
    var REDIRECT_URI = encodeURIComponent(URI);
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+util.wxid+'&redirect_uri='+ REDIRECT_URI +'&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid='+util.AppID+'&#wechat_redirect';
    if(window.navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger')>= 0){
        var code=util.getQstr('code')
        if(code){
          bookApi('ddyy.book.user.login.mpwechat',{
            code:code,
            appId:util.wxid
          }).then((res) => {
            // alert(res.data.obj)
            if(res.data.code==0){
              util.setVal('weChat',res.data.obj)
              location.replace(URI)
            }else{
              // alert('error')
              console.log('error',res.data.msg)
            }
          })
        }else{
            location.href=url;
        }
    }else {
      // location.href=url;
      // 不用微信打开
      var app_user={
        "createTime": 1490327245417,
        "openid": "o_DBNt1iDJea_JgpWUrxwxzOQWG4",
        "userAreaname": "中国 湖北 潜江",
        "userAvatar": "http://wx.qlogo.cn/mmopen/o8hX2eDaLnSLx780DXgj1s71HOWPtdMEhExtA5NtHZBEXorQ3pa7OhR1NY9OmW3KL7G1Z4kW8QOf0ySyZG8qHHNIYX1tXfYP/0",
        "userId": 15,
        "userNickname": "请勿打扰",
        "userSex": "1"
      }
      // var userInfo={
      //   "createTime":1479291119000,
      //   "enable":true,
      //   "idcardStartDate":"",
      //   "idcardStopDate":"",
      //   "modifyTime":1494926281000,
      //   "patientAddr":"rwrwerwerw",
      //   "patientCardNo":"429005199602283714",
      //   "patientCardType":"0",
      //   "patientCredit":100,
      //   "patientHealthCardNo":"23",
      //   "patientHealthCardType":"2",
      //   "patientHealthCardValid":"2",
      //   "patientId":"6127850",
      //   "patientMobile":"15700097896",
      //   "patientName":"蒋金波",
      //   "patientPostCard":"",
      //   "patientSex":"1",
      //   "patientSource":"Y",
      //   "patientState":"0",
      //   "patientTelphone":"15700097896",
      //   "realNameAuth":"",
      //   "regChannel":"",
      //   "regLocal":false,
      //   "regSpid":"9901",
      //   "regTime":1474854380000
      // }
      util.setVal('weChat',app_user)
      // util.setVal('userInfo',userInfo)
    }
  }
}
//全局跳转测试、正式替换
util.jumpTo=(direction)=>{
  // replace参数和gotoFalse参数判断返回类型
  var options={
    name:'预约挂号', //去向的项目名
    goToType:'link',//link 直跳链接  router 通过获取location.origin+location.pathname+hash
    hash:'',  //goToType为 'router'时必传
    loginState:'',
    replace:'',
    gotoFalse:'',//如为true 只return链接 不跳转
  }
  for(var x in direction){
    options[x]=direction[x]
  }
  var locationArray=[
    {
      name:'预约挂号',
      testLink:'http://guahao.zj186.com/WeChat/ddysTest-yygh/#',
      officialLink:'http://guahao.zj186.com/WeChat/ddys-yygh/#',
      ddhyLink:'http://guahao.zj186.com/WeChat/ddhy-yygh/#'
    },{
      name:'查报告单',
      testLink:'https://ddys-wechat.diandianys.com/WeChat/select-report/#/',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/select-report/#/',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/select-report/#/'
    },{
      name:'名医号',
      testLink:'http://weixin.wowys.com/HTML/woys.html#/myh',
      officialLink:'http://weixin.wowys.com/HTML/woys.html#/myh',
      ddhyLink:'http://weixin.wowys.com/HTML/woys.html#/myh'
    },{
      name:'问医生',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/consult/#/home',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/new-consult/#/home',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/ddhy/consult/#/home'
    },{
      name:'体检预约',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/medical-test/#/home',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/medical/#/home',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/ddhy/medical/#/home'
    },{
      name:'健康百科',
      testLink:'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home'
    },{
      name:'名医讲堂',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/video/#/home',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/video/#/home',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/ddhy/video/#/home'
    },{
      name:'健康商城',
      testLink:'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090',
      officialLink:'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090',
      ddhyLink:'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090'
    },{
      name:'我的预约',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/ddys/#/myAppointment',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/ddys/#/myAppointment',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/ddhy/new-ddys/#/myAppointment'
    },{
      name:'上海预约',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/SH-ddys-test/#/Home/310000',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/SH-yygh/#/Home/310000',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/ddhy/SH-yygh/#/Home/310000'
    },
    {
      name:'余杭五院登录',
      testLink:'http://test-ddys-wechat.hztywl.cn/test_yhwyLogin/#/logIn?callback=',
      officialLink:'http://test-ddys-wechat.hztywl.cn/yhwyLogin/#/logIn?callback=',
      ddhyLink:'http://test-ddys-wechat.hztywl.cn/yhwyLogin/#/logIn?callback='
    },
    {
      name:'名医挂号',
      testLink:'http://test-ddys-wechat.hztywl.cn/WeChat/mygh/#/',
      officialLink:'https://ddys-wechat.diandianys.com/WeChat/mygh/#/',
      ddhyLink:'https://ddys-wechat.diandianys.com/WeChat/mygh/#/'
    }    

  ]
  for(var i in locationArray){
    // console.log(locationArray[i])
    //先锁定那个项目
    if(options.name==locationArray[i].name){
      var a=document.createElement('a');
      // 除测试以为全部跳正式地址
      if(config.wxid=='wxe274576d295e0050'){
        a.href=locationArray[i].testLink
      }else if(config.wxid=='wxe143c7c832718250'){
        a.href=locationArray[i].ddhyLink
      }else{
        a.href=locationArray[i].officialLink
      }
      // console.log(a.origin)
      // console.log(a.pathname)

      //根据跳转类型跳转相应页面
      if(options.goToType=='link'){
        if(options.replace){
          location.replace(a.href)
          return false
        }
        if(options.gotoFalse){
          return a.href
        }
        location.href=a.href
      }else if(options.goToType=='router'&&options.hash!=''){
        if(options.name=='预约挂号'){
          if(util.getVal('userInfo') && util.getVal('userInfo').patientId){
            location.href=a.href+options.hash+"?patientId="+util.getVal('userInfo').patientId
          }else{
            location.href=a.href+options.hash+"?patientId=1"
          }
        }else{
          if(options.replace){
            location.replace(a.origin+a.pathname+options.hash)
            return false
          }
          if(options.gotoFalse){
          return a.origin+a.pathname+options.hash
          }
          console.log(a.origin+a.pathname+options.hash)
          location.href=a.origin+a.pathname+options.hash

        }
      }else{
        util.hintIsModal('跳转请求设置错误',this)
      }
    }
  }
}
export default util