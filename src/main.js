import Vue from 'vue'
import store from '@/store/index'
import router from '@/router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

import App from '@/App'
import axios from './config/httpConfig'
import './common/icons/iconfont.css'
import * as globalFilter from './filters/filters'
import Directives from './directives/index'
import Moment from 'moment'

Vue.prototype.$eventBus = new Vue()
Vue.prototype.$http = axios
Vue.prototype.$moment = Moment

Object.keys(globalFilter).forEach(key => {
  Vue.filter(key, globalFilter[key])
})

Vue.use(ElementUI)
Vue.use(Directives)

Vue.config.productionTip = false

const VUE_APP_VERSION = require('../package.json').version
const vers = window.localStorage.getItem('appVersion')
if (VUE_APP_VERSION !== vers) {
  localStorage.clear()
  window.localStorage.setItem('appVersion', VUE_APP_VERSION)
  location.reload()
}

router.beforeEach((to, from, next) => {
  if (!store.state.UserToken) {
    if (
      to.matched.length > 0 &&
      !to.matched.some(record => record.meta.requiresAuth)
    ) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    if (!store.state.permission.permissionList) {
      store.dispatch('permission/FETCH_PERMISSION').then(() => {
        next({ path: to.path })
      })
    } else {
      if (to.path !== '/login') {
        next()
      } else {
        next(from.fullPath)
      }
    }
  }
})

router.afterEach((to, from, next) => {
  var routerList = to.matched
  store.commit('setCrumbList', routerList)
  store.commit('permission/SET_CURRENT_MENU', to.name)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
