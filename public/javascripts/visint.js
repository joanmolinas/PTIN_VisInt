
// http://localhost:3000/api/
// https://ptin2018.herokuapp.com/api/
window.addEventListener('load', function () {
  /* Window resize behavior */
  window.onresize = function () {

    if (window.innerWidth <= 990) {
      document.getElementsByTagName("body")[0].style.overflowX = "hidden"
      document.getElementsByTagName("body")[0].style.overflowX = "hidden"

    } else {
      document.getElementsByTagName("body")[0].style.overflow = "hidden"
      window.scrollTo(0, 0);
    }

    // Fix mobile resize problems when user resize windows in desktop version.
    let sidebar = document.getElementById("sidebar").style.display = "block"
    let content = document.getElementById("content").style.display = "block"
  }

  new Vue({
    el: '#vue',
    data: {
      base_url_api: 'https://ptin2018.herokuapp.com/api/', /*'http://localhost:3000/api/',*/
      devices_column1: [],
      devices_column2: [],
      devices: [],
      selected_device: '',
      filter_text: '',
      device_type: '',
      queryDelay: 1000,
      zoomInicial: 17,
      maxzm: 20,
      minzm: 17,
      mapCenter: [1.7310788, 41.2220107],
      vectorLayer: '',
      iconstyle: [],
      map: '',
      heatmap: '',
      deviceInfo: [],
      deviceAtributes: [],
      deviceSensors: [],
      maxDevicesPages: false,
      min_length_filter: 3,
      nots: [],
      notReaded:0,
      readed:0,
      trans: [],
      debug: false,
      stadistics: [],
      stadisticsBuilding: [[], [], [], [], []],
      stadisticsRows: [],
      stadisticsColumns: [],

      //Colors
      gray: "rgb(125, 134, 134)",
      orange: "rgb(243, 123, 11,1)",
      yellow: "rgb(220, 241, 28)",
      blue: "rgb(0, 140, 255,1)",
      green: "rgb(7, 112, 7)",
      lightblue: "rgb(45, 231, 245)",
      purple:"rgb(162, 24, 226)",
      notifications: [], 
      page: 1,
      mapLoaded:false,
      languageLoaded:false,
      devicesLoaded:false,
      typeDev: {
        1: '<i class="fas fa-user-md img-circle center-block" style="color:white;background-color: #008CFF;width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        2: '<i class="fas fa-ambulance img-circle center-block" style="color:white;background-color: rgb(125, 134, 134);width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        3: '<i class="fas fa-fire img-circle center-block" style="color:white;background-color: rgb(243, 123, 11);width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        4: '<i class="fas fa-user img-circle center-block" style="color:white;background-color: #077007;width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        5: '<i class="fas fa-sun img-circle center-block" style="color:white;background-color: #DCF11C;width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        6: '<i class="fas fa-cloud img-circle center-block" style="color:white;background-color: rgb(45, 231, 245);width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
        7: '<i class="fas fa-medkit img-circle center-block" style="color:white;background-color: rgb(162, 24, 226);width:80px; margin-left:-5px;margin-top:30px;padding:20px;height:80px;font-size: 20px;"></i>',
      }
    },
    mounted: function () {
      if (localStorage.username === undefined) location.replace('/admin')
      else {
        this.loadMap()
        this.getLanguage()
        this.getDevices()
        this.drawDevicesOnHeatMap()
        this.loadNotifications()
      }
    },
    methods: {
      /**
       * @author ncarmona
       * @description Get all devices and print them in right and left column at the sidebar.
       * @version S2 - Removed this feature from routes/public.
       * @todo add spinner while
       */
      getDevices: function () {
        let self = this
        axios.get(this.base_url_api + 'devices?page=' + self.page + '&size=10').then(function (response) {
          //self.maxDevicesPages=response.data.pages
         
          self.devices = response.data.docs
          if(self.devices.length!=10){
            self.maxDevicesPages=true
          }
          self.devices.filter(function (device) {
            return device.lastInfo != null || device.lastInfo != undefined
          }).forEach(function (device, index) {
            if (index % 2 == 0)
              self.devices_column1.push(device)
            else
              self.devices_column2.push(device)
          });
        }).catch(function (error) {
          console.log(error.message)
        }).then(function () {
          //Draw The devices on the map
          self.devicesLoaded=true
          self.drawDevices()

        })
      },

      refreshDevices: function () {
        this.removeDevicesFromList()
        
        this.getDevices()
        this.drawDevicesOnHeatMap()
      },

      /**
       * @author ncarmona
       * @description Clear devices list.
       * @version S2
       * @todo add spinner while.
       */
      removeDevicesFromList: function () {
        devices = document.getElementById("devices-list")
        this.page = 1
        let source = this.vectorLayer.getSource();
        source.clear()
        this.devices_column1=[]
        this.devices_column2=[]
        devices.getElementsByClassName("col-md-6")[0].innerHTML = ''
        devices.getElementsByClassName("col-md-6")[1].innerHTML = ''

      },
     

      /**
       * @author ncarmona
       * @description Filter devices by name.
       * @version S2
       * @todo add spinner while. Filter by specified field.
       */
      filterByText: function () {
        
        if (this.filter_text.length == 0) {
          this.removeDevicesFromList()
          this.filterByType()
        } else if (this.filter_text.length > 0 && this.filter_text.length < this.min_length_filter)
          
          console.log("Nothing TO DO")
        else {
          let self = this
          self.removeDevicesFromList()
          setTimeout(function () {
            let query = self.base_url_api + 'devices/?'

            if (self.filter_text.length >= self.min_length_filter) {
              query += 'name=' + self.filter_text
            }
            if (self.device_type.length > 0)
              query += '&type=' + self.device_type

            if (self.debug) console.log(query)
            self.devices_column1=[]
            self.devices_column1=[]
            axios.get(query).then(function (response) {
              //self.removeDevicesFromList()
              self.devices = response.data.docs

              self.devices.filter(function (device) {
                return device.lastInfo != null || device.lastInfo != undefined
              }).forEach(function (device, index) {
               
                if (index % 2 == 0)
                  self.devices_column1.push(device)
                else
                  self.devices_column2.push(device)
              });
            }).catch(function (error) {
              console.log(error.message)
            }).then(function () {
              //Draw The devices on the map after the filter is done
              self.drawDevices()
            })
          }, this.queryDelay)
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
        let query = this.base_url_api + 'devices/?'

        if (this.device_type.length > 0){
          console.log(this.device_type)
        query += 'type=' + this.device_type
        console.log(this.device_type)
        if (this.filter_text.length >= this.min_length_filter) {
          if (query.slice(-1) != '?')
            query += '&'
          query += 'name=' + this.filter_text
        }

        if (this.debug) console.log(query)

        axios.get(query).then(function (response) {
          
          self.removeDevicesFromList()
          self.devices = response.data.docs
          
          self.devices.filter(function (device) {
            return device.lastInfo != null || device.lastInfo != undefined
          }).forEach(function (device, index) {
            if (index % 2 == 0)
              self.devices_column1.push(device)
            else
              self.devices_column2.push(device)
          });
          
        }).catch(function (error) {
          console.log(error.message)
        }).then(function () {
          //Draw The devices on the map after the filter is done
          
          self.drawDevices()
        })
      }else{
        self.getDevices()
      }
      },

      /**
       * @author ncarmona
       * @description Hide sidebar and expand the map layer.
       * @version S2 - Integrated in vuejs with pure js.
       */
      expandMap: function () {
        document.getElementById("sidebar").style.display = "none"
        document.getElementById("content").className = "col-md-12"
        if (this.heatmap.getVisible()) {
          document.getElementById("shrink").style.display = "none"
          document.getElementById("expand").style.display = "none"
        } else {
          document.getElementById("shrink").style.display = "block"
          document.getElementById("expand").style.display = "none"
        }
        this.map.updateSize()

      },

      /**
       * @author ncarmona
       * @description Display the sidebar if the map has been expanded.
       * @version S2
       */
      shrinkMap: function () {
        document.getElementById("sidebar").style.display = "block"
        document.getElementById("content").className = "col-md-6 col-md-push-6"
        this.map.updateSize()
        document.getElementById("shrink").style.display = "none"
        document.getElementById("expand").style.display = "block"

      },

      loadMap: function () {
        let self = this
        //Inicialitzate the vectorial layer empty.
        this.vectorLayer = new ol.layer.Vector({
          name: "vector",
          visible: true,
          source: new ol.source.Vector({
            features: [

            ]
          })

        });
        self.heatmap = new ol.layer.Heatmap({
          visible: false,
          source: new ol.source.Vector({
            features: [

            ]
          })
        })

        //Defining diferents sytles for the points in the map
        let style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.blue
            }),

          })
        })
        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.gray
            }),

          })
        })

        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.orange
            }),

          })
        })
        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.green
            }),

          })
        })
        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.yellow
            }),

          })
        })
        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.lightblue
            }),

          })
        })
        this.iconstyle.push(style)
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: self.purple
            }),

          })
        })
        this.iconstyle.push(style)



        //Start variable map
        //Define target (div where map is placed)
        //Define layers (vectorial and Open Street Maps)
        //Define map center, map inital zoom, maxzoom and min zoom
        this.map = new ol.Map({
          layers: [new ol.layer.Group({
            layers: [
              new ol.layer.Tile({
                title: 'Base',
                visible: true,
                source: new ol.source.OSM({ layer: 'mapaBase' })
              }),
              this.vectorLayer,
              this.heatmap
            ]
          })],

          target: document.getElementById('content'),
          view: new ol.View({
            projection: 'EPSG:4326',
            center: this.mapCenter,
            zoom: this.zoomInicial,
            minZoom: this.minzm,
            maxZoom: this.maxzm


          })
        })




        this.map.on("click", function (evt) {
          let cord = evt.coordinate
          self.detaillonMapDevices(cord)
        })
        self.mapLoaded=true

      },
      changeMap: function () {
        let icone = document.getElementById("ChangeMap")
        if (this.heatmap.getVisible()) {
          icone.title = "Canviar a Mapa de Calor"
          this.heatmap.setVisible(false);
          this.vectorLayer.setVisible(true);
          this.shrinkMap()

        } else {
          icone.title = "Canviar a Mapa de Punts"
          this.heatmap.setVisible(true);
          this.vectorLayer.setVisible(false);
          this.expandMap()
        }
      },
      //Show the detail view when a point on the map is click
      detaillonMapDevices: function (coord) {

        let self = this
        if (!self.heatmap.getVisible()) {
          let source = self.vectorLayer.getSource();
          let features = source.getFeatures();
          let i = 0
          let find = false
          while ((i < features.length) && (find == false)) {
            let geom = features[i].getGeometry()
            let pcoord = geom.getCoordinates()
            let plat = parseFloat(pcoord[0]).toFixed(4)
            let plon = parseFloat(pcoord[1]).toFixed(4)
            let lat = parseFloat(coord[0]).toFixed(4)
            let lon = parseFloat(coord[1]).toFixed(4)
            let offset = 0.00000001
            if (((plat <= lat + offset) && (plat >= lat - offset)) && ((plon <= lon + offset) && (plon >= lon - offset))) {
              this.deviceDetail(features[i].get("name"))
              find = true
            }
            i = i + 1
          }
        }
      },

      drawDevicesOnHeatMap: function () {
        let self = this
        axios.get(this.base_url_api + 'devices?paginated=false').then(function (response) {
          self.devices = response.data
          self.devices.filter(function (device) {
            return device.lastInfo != null || device.lastInfo != undefined
          }).forEach(function (device, index) {
            if (device.lastInfo.longitude != undefined && device.lastInfo.latitude != undefined) {

              let source = self.heatmap.getSource();
              let heatPoint = new ol.Feature({
                name: device._id,
                geometry: new ol.geom.Point([parseFloat(device.lastInfo.longitude), parseFloat(device.lastInfo.latitude)])

              })

              source.addFeature(heatPoint)
            }
          });
        }).catch(function (error) {
          console.log(error.message)
        })

      },
      //draw all devices then have latitude and longitude.
      drawDevices: function () {
        let self = this

        let devices = self.devices_column1.concat(self.devices_column2)
       
        //Defining variables for compute the average center
       /*  let i=0
         let latitudeCenter=0
         let longitudeCenter=0*/
        devices.forEach(function (device) {

          if (device.lastInfo) {
            if ((device.lastInfo.latitude) && (device.lastInfo.longitude)) {
              //Compute a sum of latituds and a sum of longituds only if the device values are not very diferents from the map center
            /*  if((device.lastInfo.latitude<self.mapCenter[1]+0.1)&&(device.lastInfo.latitude>self.mapCenter[1]-0.1)){

                  if((device.lastInfo.longitude<self.mapCenter[0]+0.1)&&(device.lastInfo.longitude>self.mapCenter[0]-0.1)){
                      latitudeCenter=latitudeCenter+device.lastInfo.latitude
                      longitudeCenter=longitudeCenter+device.lastInfo.longitude
                      i=i+1
                  }

              }*/

              let source = self.vectorLayer.getSource();

              let point = new ol.Feature({
                name: device._id,
                geometry: new ol.geom.Point([parseFloat(device.lastInfo.longitude), parseFloat(device.lastInfo.latitude)])

              })








              //For each device type is set one style point.
              switch (device.type) {
                case 1:
                  point.setStyle(self.iconstyle[0])
                  break;
                case 2:
                  point.setStyle(self.iconstyle[1])
                  break;
                case 3:
                  point.setStyle(self.iconstyle[2])
                  break;
                case 4:
                  point.setStyle(self.iconstyle[3])
                  break;
                case 5:
                  point.setStyle(self.iconstyle[4])
                  break;
                case 6:
                  point.setStyle(self.iconstyle[5])
                  break;
                case 7:
                  point.setStyle(self.iconstyle[6])
                  break;

              }

              //point is added
              source.addFeature(point)

            }
          }

          document.getElementById("spinner").style.display="none"
          document.getElementById("header").style.display="inherit"
          document.getElementById("sidebar").style.display="inherit"
          document.getElementById("content").style.display="block"
          self.shrinkMap()
      
        });
        //Compute the average center map and set the map center.
       /* self.mapCenter=[longitudeCenter/i,latitudeCenter/i]
        self.map.getView().setCenter(self.mapCenter)*/


      },
      //ShowDetail function params idDevice
      //Makes a request for the device data, when request finish execute the function showdetail
      deviceDetail: function (idDevice) {

        let self = this
        //Rquest for device data
        self.deviceAtributes = []
        self.deviceInfo = []
        self.deviceSensors = []
        self.selected_device = ''
        axios.get(this.base_url_api + 'devices/' + idDevice).then(function (response) {

          self.selected_device = response.data

          //

        }).then(function () {
          self.showDetail()
        })
      },
      //Show the detail view with all the data from the deviece.
      showDetail: function () {
        let self = this
        //Get array with the keys of diferent basic parameters
        let keys = Object.keys(self.selected_device)
        //For each parameters, is used the atributesTraductionNames and the atributesNames arrays to get de name of the parameter
        //each parameter is keepst in array

        keys.forEach(function (k) {
          if ((k != "lastInfo") && (k != "__v")) {
            //If device is active the icon shadow wil be green, if it is not active the icon shadow will be red
            if (k == "active") {
              console.log(self.selected_device[k])
              if (self.selected_device[k] == true) {

                document.getElementById('icon').style.boxShadow = " 0px 0px 20px 5px greenyellow"

              } else {
                document.getElementById('icon').style.boxShadow = "0px 0px 20px 5px red"
              }
              
            } else {
              if (k == "type") {
                //Each type of device have his own icon background color color
                
                switch (self.selected_device[k]) {
                  case 1:
                    document.getElementById('icon').style.backgroundColor = self.blue
                    document.getElementById('closeDetail').style.color = self.blue
                    self.deviceInfo.push(self.trans[k])
                    
                    self.deviceInfo.push(self.trans["doctor"])
                    self.deviceAtributes.push(self.deviceInfo)
                  
                    if(self.selected_device.additionalInfo){
                      self.deviceInfo = []
                      switch(self.selected_device.additionalInfo.type){
                        case 1:
                          self.deviceInfo.push(self.trans["especiality"])
                          self.deviceInfo.push(self.trans["cardiologist"])
                          self.deviceAtributes.push(self.deviceInfo)
                        break;
                        case 2:
                          self.deviceInfo.push(self.trans["especiality"])
                          self.deviceInfo.push(self.trans["general"])
                          self.deviceAtributes.push(self.deviceInfo)
                        break;
                        default:
                        break;
                      }
                      
                    }
                    
                    break;
                  case 2:
                    document.getElementById('icon').style.backgroundColor = self.gray
                    document.getElementById('closeDetail').style.color = self.gray
                    self.deviceInfo.push(self.trans[k])
                    
                    self.deviceInfo.push(self.trans["ambulance"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
                  case 3:
                    document.getElementById('icon').style.backgroundColor = self.orange
                    document.getElementById('closeDetail').style.color = self.orange
                    self.deviceInfo.push(self.trans[k])
                    
                    self.deviceInfo.push(self.trans["smoke"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
                  case 4:
                    document.getElementById('icon').style.backgroundColor = self.green
                    document.getElementById('closeDetail').style.color = self.green
                    self.deviceInfo.push(self.trans[k])
                    //self.deviceInfo.push(self.atributesTraductionNames[self.atributesNames.indexOf(k)])
                    self.deviceInfo.push(self.trans["patient"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
                  case 5:
                    document.getElementById('icon').style.backgroundColor = self.yellow
                    document.getElementById('closeDetail').style.color = self.yellow
                    self.deviceInfo.push(self.trans[k])
                   
                    self.deviceInfo.push(self.trans["weather"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
                  case 6:
                    document.getElementById('icon').style.backgroundColor = self.lightblue
                    document.getElementById('closeDetail').style.color = self.lightblue
                    self.deviceInfo.push(self.trans[k])
                    
                    self.deviceInfo.push(self.trans["air_quality"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
                  case 7:
                    document.getElementById('icon').style.backgroundColor = self.purple
                    document.getElementById('closeDetail').style.color = self.purple
                    self.deviceInfo.push(self.trans[k])
                    
                    self.deviceInfo.push(self.trans["nurse"])
                    self.deviceAtributes.push(self.deviceInfo)
                    break;
              
                  default:
                    
                    document.getElementById('icon').style.backgroundColor = "rgb(0, 140, 255)"
                    document.getElementById('close').style.color = "rgb(0, 140, 255)"
                    break;

                }
                self.deviceInfo = []
              }
              if( (k != "token")&&(k!="type")) {
                
             
                self.deviceInfo.push(self.trans[k])
                self.deviceInfo.push(self.selected_device[k])
                self.deviceAtributes.push(self.deviceInfo)

                self.deviceInfo = []
              }
            }

          }

        })

        if (self.selected_device.lastInfo) {
          //Get array with the keys of diferent Sensors parameters
          let keysSensors = Object.keys(self.selected_device.lastInfo)
          //For each parameters, is used the atributesTraductionNames and the atributesNames arrays to get de name of the parameter
          //each parameter is keepst in array

          keysSensors.forEach(function (k) {
            if (k != "date") {
              console.log(k)
              
              self.deviceInfo.push(self.trans[k])

              self.deviceInfo.push(self.selected_device.lastInfo[k])

              self.deviceSensors.push(self.deviceInfo)

              self.deviceInfo = []
            }

          })
          //If device have a localitzation the map view is center in the device.
          if ((self.selected_device.lastInfo.latitude) && (self.selected_device.lastInfo.longitude)) {

            self.map.getView().setCenter([parseFloat(self.selected_device.lastInfo.longitude), parseFloat(self.selected_device.lastInfo.latitude)])
            self.map.getView().setZoom(20)
          }
        }
        //The layer device and filter is hide and show the detail layer
        let mobilevers = document.getElementById("filter").style
        document.getElementById("devices").style.display = "none"
        document.getElementById("filter").style.display = "none"
        document.getElementById("detail").style.display = "inherit"



      },
      //Closes the detailview
      closeDetail: function () {
        //Restart global variables
        let self = this
        self.deviceAtributes = []
        self.deviceInfo = []
        self.deviceSensors = []
        self.selected_device = ''
        //hide the detail view and show the list devices
        document.getElementsByClassName("detail").innerHTML = ""
        document.getElementById("detail").style.display = "none"
        document.getElementById("devices").style.display = "inherit"
        document.getElementById("filter").style.display = "inherit"
        //The map returns to initial position
        self.map.getView().setCenter([1.7310788, 41.2220107])
        self.map.getView().setZoom(18)
      },

      /**
       * @author ncarmona
       * @description Getting translation strings.
       * @version S3
       */
      getLanguage: function () {
        let trans_file = '/lang/' + localStorage.language + '/public.json'
        let self = this

        console.log(trans_file)

        if (localStorage.language == null) {
          localStorage.language = 'cat'
        } else {
          axios.get(trans_file).then(function (trans_string) {
            self.trans = trans_string.data
            console.log("language file: " + trans_file)
            console.log("Website language: " + localStorage.language)
            
          }).catch(function (error) {
            console.log(error.message)
          }).then(function(){
            self.languageLoaded=true
          })
        }

      },

      /**
       * @author ncarmona
       * @description parse int to name lang.
       * @version S3
       */
      int2lang: function (intnum) {
        let lang = 'cat'

        if (intnum == 2) lang = 'es'
        else if (intnum == 3) lang = 'en'

        return lang
      },

      /**
       * @author ncarmona
       * @description parse lang to int number.
       * @version S3
       */
      lang2int: function (lang) {
        let intnum = 1

        if (lang == 'es') intnum = 2
        else if (lang == 'en') intnum = 3

        return intnum
      },

      /**
       * @author ncarmona
       * @description Change the website language.
       * @version S3
       */
      toggleLanguage: function (language) {
        if (this.debug) console.log("selected language: " + language)

        localStorage.language = language
        this.getLanguage()

        // Change user language in database.
        if (localStorage.username !== null) {

          let self = this
          if (this.debug) console.log("Cambiando idioma: " + this.base_url_api + 'users/' + localStorage.userID)
          console.log(localStorage.token)

          axios.put(this.base_url_api + 'users/' + localStorage.userID, {
            language: self.lang2int(localStorage.language)
          }, {
              headers: { Authorization: "bearer " + localStorage.token }
            }
          ).then(function () {

          }).catch(function (error) {
            console.log(error)
          })
        }

        //In future version this function will replace string.
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
        langlist.display = langlist.display == "block" ? "none" : "block"
      },
      toggleLanOnMobile:function(){
        let langM=document.getElementById("languagesMobil").style
        if(langM.display=="none"){
          langM.display="inherit"

        }else{
          langM.display="none"
        }
      },

      /**
       * @author ncarmona
       * @description Toggle map and sidebar.
       * @version S3
       * @todo add transitions. Hide list if user clicks outside the div.
       */
      toggleMap: function () {
        let sidebar = document.getElementById("sidebar").style
        let content = document.getElementById("content").style
        let iconToggle = document.getElementById("displaySidebarMap").classList

        if (sidebar.display == "block") {
          sidebar.display = "none"
          content.display = "block"
          iconToggle.remove("fa-map")
          iconToggle.add("fa-list-alt")
        } else {
          sidebar.display = "block"
          content.display = "none"
          iconToggle.remove("fa-list-alt")
          iconToggle.add("fa-map")
        }
      },
      newDevicePage: function () {
        let devicelist = document.getElementById("devices-list")

        if (devicelist.scrollHeight - devicelist.scrollTop === devicelist.clientHeight) {
         
                 
          console.log('num pagina' + this.page + 'paginas totales' + this.maxDevicesPages)
          if (!this.maxDevicesPages) {
            this.page = this.page + 1
            let source = this.vectorLayer.getSource();
            source.clear()
            this.getDevices()
          }
        }
      },
      loadNotifications: function () {
        let self = this
        
        axios.get(this.base_url_api + 'notifications/').then(function (response) {
            self.nots = response.data
            
            self.nots.forEach(function(not){
             
               let d= new Date(not.date)
               let t=""+d.getHours()
               date=""+d.getDate()

                switch(not.typeOfAction){
                    case 1:
                        
                        self.notifications.unshift({"_id":not._id,"message":not.requester.name,"message2":self.trans["not_heartAttack1"],"message3":date+self.trans["not_heartAttack2"],"message4":t+self.trans["not_heartAttack3"]})
                        break
                    case 2:
                        self.notifications.unshift({"_id":not._id,"message":not.requester.name,"message2":self.trans["not_general1"],"message3":date+self.trans["not_general2"],"message4":t+self.trans["not_general3"]})
                        break
                    default:
                       
                        break
                }
                if(!not.readed){
                    self.notReaded=self.notReaded+1
                }
                    
            })
            if(self.notReaded==0){
                document.getElementById("numberNots").style.display="none"
                document.getElementById("numberNotsMobil").style.display="none"
            }else{
                document.getElementById("numberNots").style.display="inherit"
                document.getElementById("numberNotsMobil").style.display="inherit"
            }
        }).catch(function (error) {
            console.log(error.message)
        })
           
            
    
    },
    newNotification:function(){
        
        this.notifications=[]
        this.nots=[]
        this.notReaded=0
        this.loadNotifications()
    },
    toggleNotifies: function () {
        let notify = document.getElementById("notifications").style
        let self = this
        if (notify.display === "none") {
            notify.display = "inline-block"
             self.nots.forEach(function(not){
                if(!not.readed){
                    self.readed=self.readed+1
                    document.getElementById(not._id).style.backgroundColor = "#1E88E5"
                    axios.put(self.base_url_api + 'notifications/'+not._id).catch(function (error) {
                        console.log(error.message)
                    })
                }else{
                    document.getElementById(not._id).style.backgroundColor = "#E3F2FD"
                }
            })

        } else {
          self.notReaded=self.notReaded-self.readed
          if(self.notReaded==0){
            document.getElementById("numberNots").style.display="none"
            document.getElementById("numberNotsMobil").style.display="none"
            
          }else{
            document.getElementById("numberNots").style.display="inherit"
            document.getElementById("numberNotsMobil").style.display="inherit"
          }
            notify.display = "none"
        }

    },
    toggleNotsOnMobile:function(){
      let notify = document.getElementById("notificationsMobile").style
      let self = this
      if (notify.display === "none") {
          notify.display = "inherit"
          document.getElementById("iLangMobile").style.display="none"
          document.getElementById("languagesMobil").style.display="none"
           self.nots.forEach(function(not){
              if(!not.readed){
                  self.readed=self.readed+1
                  document.getElementById(not._id).style.backgroundColor = "#1E88E5"
                  axios.put(self.base_url_api + 'notifications/'+not._id).catch(function (error) {
                      console.log(error.message)
                  })
              }else{
                  document.getElementById(not._id).style.backgroundColor = "#E3F2FD"
              }
          })

      } else {
        self.notReaded=self.notReaded-self.readed
        if(self.notReaded==0){
          document.getElementById("numberNots").style.display="none"
        }
          notify.display = "none"
          document.getElementById("iLangMobile").style.display="inherit"
      }
      
    },
      showStaticsTable: function () {
        let self = this
        self.stadisticsBuilding = [[], [], [], [], []]
        self.stadisticsRows = []
        self.stadisticsColumns = []
        self.stadisticsRows.push(0)
        self.stadisticsColumns.push(0)
        axios.get(this.base_url_api + 'devices/stadistics').then(function (response) {
          self.stadistics = response.data

          let stats = []
          Object.keys(self.stadistics).forEach(function (k, index) {

            switch (k) {
              case "Edifici A":
                self.stadisticsBuilding[index + 1][0] = self.trans["eA"]
                break;
              case "Edifici B":
                self.stadisticsBuilding[index + 1][0] = self.trans["eB"]
                break;
              case "Neàpolis":
                self.stadisticsBuilding[index + 1][0] = self.trans["neapolis"]
                break;
              case "Exterior":
                self.stadisticsBuilding[index + 1][0] = self.trans["out"]
                break;
            }

            stats[index] = self.stadistics[k]
            self.stadisticsRows.push(index + 1)


          })


          stats.forEach(function (stadistic, indexTot) {



            Object.keys(stadistic).forEach(function (k, index) {

              if (self.stadisticsBuilding[0][index + 1] == undefined) {

                switch (k) {
                  case "1":
                    self.stadisticsBuilding[0][index + 1] = self.trans["doctor"]
                    break;
                  case "2":
                    self.stadisticsBuilding[0][index + 1] = self.trans["ambulance"]
                    break;
                  case "3":
                    self.stadisticsBuilding[0][index + 1] = self.trans["smoke"]
                    break;
                  case "4":
                    self.stadisticsBuilding[0][index + 1] = self.trans["patient"]
                    break;
                  case "5":
                    self.stadisticsBuilding[0][index + 1] = self.trans["weather"]
                    break;
                  case "6":
                    self.stadisticsBuilding[0][index + 1] = self.trans["air_quality"]
                    break;
                  case "7":
                  self.stadisticsBuilding[0][index + 1] = self.trans["nurse"]
                    break;
                  case "total":
                    self.stadisticsBuilding[0][index + 1] = self.trans["total"]
                    break;
                  case "actius":
                    self.stadisticsBuilding[0][index + 1] = self.trans["activeDevice"]
                    break;
                }

                self.stadisticsColumns.push(index + 1)
              }
              self.stadisticsBuilding[indexTot + 1][index + 1] = stadistic[k]
            })



          })

          //self.stadistics.getKeys.forEach(function (stadistic) {
        }).then(function () {
          console.log(self.stadisticsBuilding)
          document.getElementById("devices").style.display = "none"
          
          document.getElementById("detail").style.display = "none"
          document.getElementById("charts").style.display = "none"
          document.getElementById("staticsTable").style.display = "inherit"
          document.getElementById(self.trans["doctor"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["patient"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["ambulance"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["smoke"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["air_quality"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["weather"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["total"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["activeDevice"]).style.backgroundColor = "#0D47A1";
         // document.getElementById(self.trans["nurse"]).style.backgroundColor="#ccc";
          document.getElementById(self.trans["eA"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["eB"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["neapolis"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["out"]).style.backgroundColor = "#0D47A1";
          document.getElementById(self.trans["doctor"]).style.color = "white";
          document.getElementById(self.trans["patient"]).style.color = "white";
          document.getElementById(self.trans["ambulance"]).style.color = "white";
          document.getElementById(self.trans["smoke"]).style.color = "white";
          document.getElementById(self.trans["air_quality"]).style.color = "white";
          document.getElementById(self.trans["weather"]).style.color = "white";
          document.getElementById(self.trans["total"]).style.color = "white";
          document.getElementById(self.trans["activeDevice"]).style.color = "white";
         // document.getElementById(self.trans["nurse"]).style.backgroundColor="#ccc";
          document.getElementById(self.trans["eA"]).style.color = "white";
          document.getElementById(self.trans["eB"]).style.color = "white";
          document.getElementById(self.trans["neapolis"]).style.color = "white";
          document.getElementById(self.trans["out"]).style.color = "white";
        })


      },
      closeTable: function () {
        document.getElementById("devices").style.display = "inherit"
        
        document.getElementById("detail").style.display = "none"
        document.getElementById("staticsTable").style.display = "none"
      },
      displayStatistics: function () {
        this.displayHumidityChart()
        this.displayTemperatureChart()
      },
      displayCharts: function () {
        let devices = document.getElementById('devices').style
        let charts = document.getElementById('charts').style
        devices.display = 'none'
        charts.display = 'block'
        this.displayStatistics()
      },
      closeCharts: function () {
        let devices = document.getElementById('devices').style
        let charts = document.getElementById('charts').style
        devices.display = 'block'
        charts.display = 'none'
      },
      displayChartsMobile: function () {
        document.getElementById('content').style.display = 'None'
        this.displayCharts()
        document.getElementById('responsive-menu').style.display = 'none'
      },
      displayHumidityChart: function () {
        axios.get(this.base_url_api + 'devices/hum').then(response => {
          let humy = response.data[0]
          humy.forEach(e => {
            if (e === null) e = 0;
          })
          new Chart(document.getElementById("humidity"), {
            type: 'bar',
            data: {
              labels: ['10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
              datasets: [
                {
                  label: "HR",
                  backgroundColor: "#3e95cd",
                  data: humy
                }
              ]
            },
            options: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Humedad relativa media cada 2 horas'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    max: 100,
                    min: 0
                  }
                }]
              }
            }
          });
        }).catch(e => {
          console.log(e)
        })
      },
      displayTemperatureChart: function () {
        axios.get(this.base_url_api + 'devices/temp').then(response => {
          let temp = response.data[0]
          temp.forEach(e => {
            if (e === null) e = 0;
          })
          console.log(response.data)
          new Chart(document.getElementById("temperature"), {
            type: 'bar',
            data: {
              labels: ['10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
              datasets: [
                {
                  label: "En ºC",
                  backgroundColor: "#3e95cd",
                  data: temp
                }
              ]
            },
            options: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Temperatura media por horas'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    max: 40,
                    min: 20
                  },
                }]
              }
            }
          });
        }).catch(e => {
          console.log(e)
        })
      }
    }
  })
})