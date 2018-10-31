import util from './util.js'
const  init= {};
if (util.getVal('weChat') && util.getVal('weChat') != null) {
} else {

  util.initData()
}
export default init