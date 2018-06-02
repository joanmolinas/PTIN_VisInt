import Vue from 'vue'
import Router from 'vue-router'

// Pages
import AdminDevices from '@/pages/AdminDevices'
import AdminModifyUsers from '@/pages/AdminModifyUsers'
import AdminUsers from '@/pages/AdminUsers'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/admin/devices.html',
      name: 'admindevices',
      component: AdminDevices
    }, {
      path: '/admin/users.html',
      name: 'adminUsers',
      component: AdminUsers
    }, {
      path: '/admin/users/:id.html',
      name: 'adminmodifyuser',
      component: AdminModifyUsers
    }, {
      path: '/admin/login.html',
      name: 'login',
      component: Login
    }
  ]
})
