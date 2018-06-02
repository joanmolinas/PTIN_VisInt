<template>
    <div id="header" class="col-md-12">
        <nav>
            <span>
                <a href="#" class="hidden-lg hidden-md" v-on:click="toggleMenu('responsive-menu')">
                    <i class="fas fa-bars"></i>
                </a>
            </span>
                <a href="/" id="inici" v-on:click="refreshDevices" v-bind:title="trans['home_icon']" class="hidden-xs hidden-sm">
                    <i class="fas fa-home"></i>
                </a>
                <span id="settings" class="pull-right">
                    <a href="/admin/" title="Cerrar sesión como admin" v-on:click="logout">
                      <i class="fas fa-sign-out-alt"></i>
                    </a>
                </span>
          </nav>
        </div>
</template>

<script>
import axios from 'axios'
export default {
  props: [],
  data () {
    return {
      filter_text: '',
      device_type: '',
      trans: ''
    }
  },
  methods: {
    /**
     * @author ncarmona
     * @description Change the website language.
     * @version S3
     */
    toggleLanguage: function (language) {
      if (this.debug) console.log('selected language: ' + language)

      localStorage.language = language
      this.getLanguage()

      // Change user language in database.
      if (localStorage.username !== null) {
        let self = this
        if (this.debug) console.log('Cambiando idioma: ' + this.endpoint + 'users/' + localStorage.userID)
        console.log(localStorage.token)

        axios
          .put(
            this.endpoint + 'users/' + localStorage.userID,
            {
              language: self.lang2int(localStorage.language)
            },
            {
              headers: { Authorization: 'bearer ' + localStorage.token }
            }
          )
          .then(function () {})
          .catch(function (error) {
            console.log(error)
          })
      }

      // In future version this function will replace string.
      location.reload()
    },

    /**
     * @author ncarmona
     * @description Toggle menus.
     * @version S3
     * @todo add transitions. Hide list if user clicks outside the div.
     */
    toggleMenu: function (layer) {
      let langlist = document.getElementById(layer).style
      langlist.display = langlist.display === 'block' ? 'none' : 'block'
    },
    /**
    * @author ncarmona
    * @description Toggle map and sidebar.
    * @version S3
    * @todo add transitions. Hide list if user clicks outside the div.
    */
    toggleMap: function () {
      let sidebar = document.getElementById('sidebar').style
      let content = document.getElementById('content').style
      let iconToggle = document.getElementById('displaySidebarMap').classList

      if (sidebar.display === 'block') {
        sidebar.display = 'none'
        content.display = 'block'
        iconToggle.remove('fa-map')
        iconToggle.add('fa-list-alt')
      } else {
        sidebar.display = 'block'
        content.display = 'none'
        iconToggle.remove('fa-list-alt')
        iconToggle.add('fa-map')
      }
    },
    refreshDevices: function () {
      self.removeDevicesFromList()
      self.getDevices()
    },
    /**
     * @author ncarmona
     * @description Filter devices by name.
     * @version S2
     * @todo add spinner while. Filter by specified field.
     */
    filterByText: function () {
      if (this.filter_text.length === 0) {
        this.removeDevicesFromList()
        this.filterByType()
      } else if (this.filter_text.length > 0 && this.filter_text.length < this.min_length_filter) {
        console.log('Nothing TO DO')
      } else {
        let self = this
        setTimeout(function () {
          let query = self.endpoint + 'devices/?'

          if (self.filter_text.length >= self.min_length_filter) {
            query += 'name=' + self.filter_text
          }
          if (self.device_type.length > 0) {
            query += '&type=' + self.device_type
          }
          if (self.debug) console.log(query)

          axios.get(query).then(function (response) {
            self.removeDevicesFromList()
            self.devices = response.data

            self.devices.filter(function (device) {
              return device.lastInfo !== null || device.lastInfo !== undefined
            }).forEach(function (device, index) {
              console.log(device)
              if (index % 2 === 0) {
                self.devices_column1.push(device)
              } else {
                self.devices_column2.push(device)
              }
            })
          }).catch(function (error) {
            console.log(error.message)
          }).then(function () {
            // Draw The devices on the map after the filter is done
            self.drawDevices()
          })
        }, this.queryDelay)
      }
    },
    /**
     * @author ncarmona
     * @description Hide sidebar and expand the map layer.
     * @version S2 - Integrated in vuejs with pure js.
     */
    expandMap: function () {
      document.getElementById('sidebar').style.display = 'none'
      document.getElementById('content').className = 'col-md-12'
      document.getElementById('shrink').style.display = 'block'
    },
    /**
     * @author ncarmona
     * @description Remove token and username from localstorage
     * @version S2.
     */
    logout: function () {
      if (this.debugging) console.log('Cerrando sesión')
      if (localStorage.token) {
        localStorage.clear()
        window.location.replace('/#/admin/login.html')
      }
    },
    /**
      * @author ncarmona
      * @description Filter devices by type.
      * @version S2
      * @todo add spinner while.
      */
    filterByType: function () {
      this.removeDevicesFromList()
      let self = this
      let query = this.endpoint + 'devices/?'

      if (this.device_type.length > 0) {
        query += 'type=' + this.device_type
      }
      if (this.filter_text.length >= this.min_length_filter) {
        if (query.slice(-1) !== '?') {
          query += '&'
        }
        query += 'name=' + this.filter_text
      }

      if (this.debug) console.log(query)

      axios.get(query).then(function (response) {
        self.removeDevicesFromList()
        self.devices = response.data
        self.devices.filter(function (device) {
          return device.lastInfo !== null || device.lastInfo !== undefined
        }).forEach(function (device, index) {
          if (index % 2 === 0) {
            self.devices_column1.push(device)
          } else {
            self.devices_column2.push(device)
          }
        })
      }).catch(function (error) {
        console.log(error.message)
      }).then(function () {
        // Draw The devices on the map after the filter is done
        self.drawDevices()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$header-height: 65px;
$sidebar-menu-color: #0D47A1;

#header {
  height: $header-height;
  background-color: $sidebar-menu-color;
  border-bottom: 1px solid #ccc;
  padding: 0;
  margin: 0;

  nav {
    padding-top: 15px;

    #responsive-menu {
      background-color: white;
      border: 1px solid #ccc;
      margin-top: 13px;
      display: none;
      width: 200px;
      position: absolute;
      z-index: 100;

      a {
        color: #ccc;
        font-size: 15px;
        padding: 10px 5px 10px 5px;
        display: block;
        border-bottom: 1px solid #ccc;
        margin-left: 0px;
        padding-left: 20px;

        .icon {
          font-size: 25px;
          margin-right: 10px;
        }
      }
    }

    a {
      color: white;
      font-size: 25px;
      margin-left: 20px;
      text-decoration: none;

      sup {
        font-size: small;
        font-weight: bolder;
        padding: 2px 4px 2px 4px;
        border-radius: 4px;

        sup {
          font-size: small;
          padding: 2px 4px 2px 4px;
          border-radius: 4px;
        }
      }
      .no-notification {
        background-color: violet;
      }

      .new-notification {
        background-color: blue;
        font-weight: bolder;
      }
    }

    #settings {
      padding-right: 20px;

      #filterMobile {
        display: none;
        background-color: white;
        border-bottom: 1px solid #ccc;
        padding: 3%;
        .filter-input {
          border-radius: 10px;
          padding-left: 10px;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-right: 15px;
          margin-right: 10px;
          border: 1px solid $sidebar-menu-color;
          background-color: white;

          input {
            width: 90%;
            border: 0;
          }

          .filter-search-icon {
            font-size: 20px;
            color: $sidebar-menu-color;
          }
        }
      }

      #lang-list {
        display: none;
        position: relative;
        z-index: 100;
        nav {
          margin-top: 13px;
          border: 1px solid #ccc;
          background-color: white;

          a {
            display: block;
            font-size: 15px;
            color: #ccc;
            border-bottom: 1px solid #ccc;
            margin-left: 0;
            padding-bottom: 5px;
            padding-top: 5px;

            img {
              margin-right: 8px;
              margin-left: 8px;
            }
          }
          a:hover {
            background-color: #ccc;
            color: white;
          }

          .selected-lang {
            font-weight: bolder;
          }
        }
      }
    }
  }
}
</style>
