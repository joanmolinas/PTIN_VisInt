<template>
  <div id="sidebar" class="col-md-2">
      <sidebar-option url="/admin/devices.html" text="Dispositivos" icon="fas fa-microchip"></sidebar-option>
      <sidebar-option url="/admin/users.html" text="Usuarios" icon="fa fa-user"></sidebar-option>
  </div>
</template>

<script>
import SidebarOptions from '@/components/AdminSidebar/AdminSidebarOptions'
export default {
  components: {
    'sidebar-option': SidebarOptions
  }
}
</script>

<style lang="scss" scoped>
$vh: 93vh;
#sidebar {
  margin-top:0;
  padding: 0;
  min-height: $vh;
  background-color: #E3F2FD;
}
</style>
