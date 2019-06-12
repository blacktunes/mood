import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import gallery from 'img-vuer'

/* eslint-disable */
// HB打包返回键监听
// var backnum = 1;
// document.addEventListener('plusready',function(){
//   plus.key.addEventListener("backbutton",function(e){
//     if(backnum < 2){
//       backnum++;
//       plus.nativeUI.toast('<span>再按一次返回退出应用</span>', {
//         type: 'richtext'
//       })
//       return false;
//     }else{
//       var _self = plus.webview.currentWebview();
//       _self.close();
//     }
//   },false);
// })
/* eslint-enable */

Vue.use(gallery, {
  swipeThreshold: 100,
  isIndexShow: true,
  useCloseButton: false
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
