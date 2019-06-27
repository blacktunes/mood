import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import gallery from 'img-vuer'
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'
import VueImgLazyLoad from 'vue-images-lazy-load'

Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})

Vue.use(VueImgLazyLoad, {
  delayTime: 20
})

/* eslint-disable */
// HB打包返回键监听
var firstBack = null
document.addEventListener('plusready',() => {
  plus.key.addEventListener("backbutton",(e) => {
    var nowHref = location.href.split('#')
    if (nowHref[1] !== '/') {
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

Vue.use(gallery, {
  swipeThreshold: 100,
  isIndexShow: false,
  useCloseButton: false
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
