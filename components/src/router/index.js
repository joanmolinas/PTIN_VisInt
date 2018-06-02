import Vue from 'vue'
import Router from 'vue-router'

// Pages
import AdminDevices from '@/pages/AdminDevices'
import AdminModifyUsers from '@/pages/AdminModifyUsers'
import AdminUsers from '@/pages/AdminUsers'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/devices',
      name: 'admindevices',
      component: AdminDevices
    }, {
      path: '/users',
      name: 'adminUsers',
      component: AdminUsers
    }, {
      path: '/user-:id',
      name: 'adminmodifyuser',
      component: AdminModifyUsers
    }, {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})
