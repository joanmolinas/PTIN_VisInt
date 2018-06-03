<template>
  <div id="adminDevices">
      <header-app :endpoint="endpoint"></header-app>
      <sidebar :endpoint="endpoint"></sidebar>
      <admin-content :endpoint="endpoint"></admin-content>
  </div>
</template>

<script>
import Header from '@/components/Header'
import AdminSidebar from '@/components/AdminSidebar'
import AdminDevicesList from '@/components/AdminDevicesList'

export default {
  name: 'AdminDevices',
  props: ['endpoint'],
  components: {
    'header-app': Header,
    'sidebar': AdminSidebar,
    'admin-content': AdminDevicesList
  },
  mounted () {
    if (localStorage.token === undefined) {
      location.replace('/admin')
    }
  }
}
</script>
