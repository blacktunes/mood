import Vue from 'vue'
import Router from 'vue-router'
import index from './views/index'
import register from './views/register'
import userInfo from './views/userInfo'

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
      component: () => import('./views/detail')
    }
  ]
})
