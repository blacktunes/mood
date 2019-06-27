import Vue from 'vue'
import Router from 'vue-router'
import index from './views/index'
import register from './views/register'
import userInfo from './views/userInfo'
import detail from './views/detail'
import message from './views/message'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: userInfo
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/message',
      name: 'message',
      component: message
    }
  ]
})
