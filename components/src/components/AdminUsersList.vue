<template>
  <div id="content" class="col-md-10">
    <div class="row">
      <div class="col-md-6">
        <h2>Usuarios</h2>
      </div>
      <div class="col-md-6 pull-right">
      </div>
    </div>
<table class="table">
  <thead class="thead-light">
    <tr>
      <th scope="col">Usuario</th>
      <th scope="col">Modificar</th>
      <th scope="col">Borrar</th>
    </tr>
  </thead>
  <tbody id="table-content" v-for="user in users" :key="user._id">
    <user-row :username="user.username" :userid="user._id" :endpoint="endpoint"></user-row>
  </tbody>
</table>
  </div>
</template>

<script>
import axios from 'axios'
import UserRow from '@/components/AdminUsersList/UserRow'

export default {
  name: 'AdminUsersList',
  props: ['endpoint'],
  components: {
    'user-row': UserRow
  },
  data () {
    return {
      users: []
    }
  },
  mounted () {
    axios.get(this.endpoint + 'users').then((users) => {
      this.users = users.data.docs
    }).catch((e) => {
      console.log('Error de conexión con el servidor')
    })
  }
}
</script>

<style lang="scss" scoped>
#content {
  padding: 30px 25px 30px 25px;
  height: 93vh;
}
</style>
