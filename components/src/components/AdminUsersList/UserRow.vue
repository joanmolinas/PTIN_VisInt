<template>
  <tr id="userRow">
    <th scope="row">{{username}}</th>
    <td><a :href="'/admin/#/user-' + this.userid">Modificar</a></td>
  </tr>
</template>
<script>
export default {
  props: ['username', 'userid'],
  name: 'UserRow',
  computed: {
    modifyUserURL: function () {
      return '/admin/users/' + this.userid
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
