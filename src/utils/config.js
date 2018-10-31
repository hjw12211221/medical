const config = {};
config.basePostData = {
  random: "1234",
  spid: "1001",
  channel: "23",
  format: "JSON",
  oper: "127.0.0.1",
  sign: "3f52f63fad63c5dd209d28420977fb5d",
}
// 公众号微信id设置
config.wxid='wxb0fff55e9352f5f5'
// 点点医生
if(config.wxid=='wxb0fff55e9352f5f5'){
  config.AppID='wx350294e57d85e10d'
  config.name = 'ddys_'
  config.HOST = 'https://ddys-book.diandianys.com/app' //正式
  config.baseApi = 'https://ddys-base.diandianys.com/app' //正式
  config.loginURL = 'https://ddys-wechat.diandianys.com/login/#/logIn?callback='
  
}else if(config.wxid == 'wxe143c7c832718250'){
  config.name = 'ddhy_'
  config.AppID='wx350294e57d85e10d'
  config.basePostData.pingxxPayAppType = "DDHY"
  config.HOST = 'https://ddys-book.diandianys.com/app' //正式
  config.baseApi = 'https://ddys-base.diandianys.com/app' //正式
  config.loginURL = 'https://ddys-wechat.diandianys.com/ddhyLogin/#/logIn?callback='
}else if(config.wxid == 'wxe274576d295e0050'){
  config.name = 'ddysTest_'
  config.AppID = 'wx33b1da8486ed4cd2'
  config.HOST = 'http://yyddysws.hztywl.cn/app'//测试
  config.baseApi='http://test-ddys-base.hztywl.cn/app'//测试
  config.loginURL='http://test-ddys-wechat.hztywl.cn/loginTest/#/logIn?callback='
}else if(config.wxid==''){
  // 如果微信id为空  如其它公众号不提供id服务的接入
  config.HOST = 'https://ddys-book.diandianys.com/app' //正式
  config.baseApi = 'https://ddys-base.diandianys.com/app' //正式
  config.name = 'other_'
  config.loginURL='http://guahao.zj186.com/login/#/logIn?callback='

}

config.getVal = function(name) {
  var db = window.localStorage;
  return JSON.parse(db.getItem(config.name + name));
}
config.getQstr = function(name) {
  var reg = new RegExp("" + name + "=([^&]+?)(#|&|$)", 'i');
  var url = window.location.href;
  var index = url.indexOf('?');
  var r = url.substr(index).match(reg);
  if (r != null) return unescape(r[1]);
  return null;
}


if (config.getQstr('clickLocation') && config.getVal('weChat')) {
  config.basePostData.clickLocation = config.getQstr('clickLocation')
}
export default config
