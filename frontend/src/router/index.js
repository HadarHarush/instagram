import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from '../views/auth'
import feed from '../views/feed'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: auth,
  },
  {
    path: '/feed',
    name: 'feed',
    component: feed,
  },
  {
    path: '/',
    redirect: '/auth',
  },
]

const router = new VueRouter({
  routes,
})

export default router
