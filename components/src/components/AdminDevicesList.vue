<template>
  <div id="content" class="col-md-10">
    <div class="row">
      <div class="col-md-6">
        <h2>Dispositivos</h2>
      </div>
      <div id="inf"></div>
      <div class="status-device pull-right"> Mostrar
        <select>
          <option v-on:click="displayAllDevices">Todos los dispositivos</option>
          <option v-on:click="displayEnabledDevices">Dispositivos habilitados</option>
          <option v-on:click="displayDisabledDevices">Dispositivos deshabilitados</option>
        </select>
      </div>
    </div>
<table class="table">
  <thead class="thead-light">
    <tr>
      <th scope="col">Dispositivo</th>
      <th scope="col">Tipo</th>
      <th scope="col">Habilitar / deshabilitar</th>
      <th scope="col">Eliminar</th>
    </tr>
  </thead>
  <tbody id="table-content" v-for="device in devices" :key="device._id" v-if="!device.deleted">
    <device :devid="device._id" :devname="device.name" :endpoint="endpoint" :devtoken="device.token" :type="device.type"></device>
  </tbody>
</table>
<!-- <paginator></paginator> -->
  </div>
</template>
<script>
import axios from 'axios'
import DeviceRow from '@/components/AdminDevicesList/DeviceRow'

export default {
  name: 'AdminDevicesList',
  props: ['endpoint'],
  components: {
    'device': DeviceRow
  },
  data () {
    return {
      devices: []
    }
  },
  mounted () {
    this.displayAllDevices()
  },
  methods: {
    toggleDisplay: function (type) {
      if (type === 0) {
        this.displayAllDevices()
      } else if (type === 1) {
        this.displayEnabledDevices()
      } else if (type === 2) {
        this.displayDisabledDevices()
      }
    },
    displayAllDevices: function () {
      console.log(this.endpoint)
      axios.get(this.endpoint + 'devices').then((device) => {
        this.devices = device.data.docs
      })
      console.log(this.devices)
    },
    displayEnabledDevices: function () {
      axios.get(this.endpoint + 'devices?active=true').then((device) => {
        this.devices = device.data.docs
      })
    },
    displayDisabledDevices: function () {
      console.log('disabled devices')
      axios.get(this.endpoint + 'devices?active=false').then((device) => {
        this.devices = device.data.docs
        console.log(this.devices)
      })
    },
    deviceTypeID2String: function (id) {
      let string = ''

      if (id === 1) {
        string = 'Doctor'
      } else if (id === 2) {
        string = 'Ambulancia'
      } else {
        string = 'Desconocido'
      }

      return string
    }
  }
}
</script>

<style lang="scss" scoped>
#content {
  padding: 30px 25px 30px 25px;
  height: 93vh;
}
</style>
