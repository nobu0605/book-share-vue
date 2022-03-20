// @ts-nocheck
// TODO temporary fix
import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from './pages/index.vue'
import Register from './pages/register/index.vue'
import Completed from './pages/completed/index.vue'
import Home from './pages/home/index.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: IndexPage,
      },
      {
        path: '/register',
        component: Register,
      },
      {
        path: '/completed',
        component: Completed,
      },
      {
        path: '/home',
        component: Home,
      },
    ],
  })
}
