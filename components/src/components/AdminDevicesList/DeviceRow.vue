<template>
    <tr :id="devid">
      <th scope="row">{{this.devname}}</th>
      <td>{{displayDeviceType}}</td>
      <td>
        <a href="#" v-on:click="enableDevice"><i class="fas fa-lock" style="color:gold;"></i></a> /
        <a href="#" v-on:click="disableDevice"><i class="fas fa-lock-open" style="color:green;"></i></a>
      </td>
      <td>
      <a href="#" v-on:click="deleteDevice"><i class="fas fa-window-close" style="color:red;"></i></a>
      </td>
    </tr>
</template>
<script>
import axios from 'axios'
export default {
  props: ['endpoint', 'devid', 'devname', 'devtoken', 'type'],
  name: 'DeviceRow',
  methods: {
    disableDevice: function () {
      axios.put(this.endpoint + 'devices/' + this.devid, {
        active: false
      }, {
        headers: {Authorization: 'bearer ' + this.devtoken}
      }).then(response => {
        console.log('Device' + this.devname + ' has been disabled.')
      }).catch(e => {
        console.log(e)
      })
    },
    enableDevice: function () {
      axios.put(this.endpoint + 'devices/' + this.devid, {
        active: true
      }, {
        headers: {Authorization: 'bearer ' + this.devtoken}
      }).then(response => {
        console.log('Device' + this.devname + ' has been enabled.')
      }).catch(e => {
        console.log(e)
      })
    },
    deleteDevice: function () {
      axios.put(this.endpoint + 'devices/' + this.devid, {
        deleted: true
      }, {
        headers: {Authorization: 'bearer ' + this.devtoken}
      }).then(response => {
        document.getElementById(this.devid).style.display = 'none'
        console.log('Device' + this.devname + ' has been deleted.')
      }).catch(e => {
        console.log(e)
      })
    }
  },
  computed: {
    displayDeviceType: function () {
      let type = {
        1: 'Doctor',
        2: 'Ambulancia',
        3: 'Sensor de humo',
        4: 'Paciente',
        5: 'Sensor de temperatura',
        6: 'Sensor de aire',
        7: 'Enfermero'
      }
      return type[this.type]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
