import axios from 'axios'

export default class DevicesAPI {
  devices = []
  devicesCallAPI (endpoint) {
    axios.get(endpoint + 'devices').then((device) => {
      this.devices.push(device)
    })
  }
  getDevices () {
    return this.devices
  }
}
