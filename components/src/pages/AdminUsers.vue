<template>
  <div id="adminUsers">
      <header-app :endpoint="endpoint"></header-app>
      <sidebar :endpoint="endpoint"></sidebar>
      <admin-content :endpoint="endpoint"></admin-content>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AdminSidebar from '@/components/AdminSidebar'
import AdminUsersList from '@/components/AdminUsersList'

export default {
  name: 'AdminUsers',
  props: ['endpoint'],
  components: {
    'header-app': Header,
    'sidebar': AdminSidebar,
    'admin-content': AdminUsersList
  },
  mounted () {
    if (localStorage.token === undefined) {
      location.replace('/admin')
    }
  }
}
</script>
