import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
import VueLazyload from 'vue-lazyload'
import VueSocketIO from 'vue-socket.io'
import 'default-passive-events'
// import VConsole from 'vconsole'

import { serverUrl } from '@/api/store'

// eslint-disable-next-line
// new VConsole()

Vue.use(new VueSocketIO({
  debug: false,
  connection: serverUrl
}))

Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})

Vue.use(VueLazyload, {
  preLoad: 1.5,
  loading: require('./assets/lazy.gif'),
  throttleWait: 20
})

/* eslint-disable */
// HB打包返回键监听
var firstBack = null
document.addEventListener('plusready',() => {
  plus.key.addEventListener('backbutton',(e) => {
    var nowHref = location.href.split('#')
    if (store.state.inputShow) {
      store.commit('SET_INPUT_SHOW', false)
    } else if (nowHref[1] !== '/') {
      history.go(-1)
    } else {
      if (!firstBack) {
        firstBack = new Date().getTime()
        plus.nativeUI.toast('<span>再按一次返回退出应用</span>', {
          type: 'richtext'
        })
        setTimeout(() => {
          firstBack = null
        }, 2000)
      } else {
        if (new Date().getTime() - firstBack < 1000) {
          var _self = plus.webview.currentWebview()
          _self.close()
        }
      }
    }
  },false)
})
/* eslint-enable */

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
