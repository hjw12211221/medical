import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from '../pages/home/home.vue'
import comboHome from '../pages/home/comboHome.vue'
import comboDetails from '../pages/home/comboDetails.vue'
import orgHome from '../pages/home/orgHome.vue'
import orgDetails from '../pages/home/orgDetails.vue'
import team from '../pages/home/team.vue'
import search from '../pages/home/search.vue'
import verifyOrder from '../pages/home/verifyOrder.vue'
import pay from '../pages/home/pay.vue'
// 我的
import clear from '../pages/my/clear.vue'

import myMedical from '../pages/my/myMedical.vue'
import myCoupon from '../pages/my/coupon.vue'
import usableCoupon from '../pages/my/usableCoupon.vue'
import patient from '../pages/my/patient.vue'
import patientInfo from '../pages/my/patientInfo.vue'
import addPatient from '../pages/my/addPatient.vue'
import myghPay from '../pages/home/myghPay.vue'
export default new Router({
  // mode: 'hash',
  // mode: 'history',
  routes: [
// 咨询流程页面
    { path: '/home', component: home },
    { path: '/comboDetails/:id', component: comboDetails},
    { path: '/comboHome', component: comboHome,children:[
      { 
        path: '/comboDetails/:id',
        component: comboDetails 
      }
    ], meta:{ keepAlive: true}},
    { path: '/orgHome', component: orgHome, meta:{ keepAlive: true}},
    { path: '/orgDetails/:id', component: orgDetails },
    { path: '/team', component: team,meta:{ keepAlive: true},children:[{
        path:'orgHome',
        component: orgHome
       }
    ]},
    { path: '/search', component: search },
    { path: '/verifyOrder/:id', component: verifyOrder },
    { path: '/pay/:orderId/:bookPatId', component: pay },
    { path: '/myghPay', component: myghPay },
    
// 我的
    { path: '/clear', component: clear },

    { path: '/myMedical', component: myMedical },
    { path: '/myCoupon', component: myCoupon },
    { path: '/usableCoupon/:price', component: usableCoupon },
    { path: '/patient', component: patient },
    { path: '/patientInfo/:patId', component: patientInfo },
    { path: '/addPatient', component: addPatient }
    // { path: '*', redirect: '/home' }
  ]
})