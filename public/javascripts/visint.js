window.addEventListener('load', function () {
    new Vue({
        el: '#sidebar',
        data: {
            base_url_api: 'http://localhost:3000/api/',
            devices: [],
            devices_column1: [],
            devices_column2: [],
            selected_device: '',
            filter_text: '',
            device_type: '*',
            queryDelay: 1000,
            zoomInicial: 17,
            maxzm: 20,
            minzm: 17,
            vectorLayer: '',
            iconstyle: '',
            map: '',
            deviceInfo:[],
            deviceAtributes:[],
            deviceSensors:[],
            atributesNames:["latitude","longitude","creationDate","name","_id","modificationDate","type","active"],
            atributesTraductionNames:["Latitud","Longitud","Creacion","Nombre","Identificador","Modificacion","Tipo","Activo",]
        },
        mounted: function () {
            this.loadMap()
            this.drawDevices()
            return this.getDevices()
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

                axios.get(this.base_url_api + 'devices').then(function (response) {
                    self.devices = response.data
                    self.devices.filter(function(device){
                        return device.lastInfo!=null || device.lastInfo!=undefined
                    }).forEach(function (device, index) {
                        if (index % 2 == 0)
                            self.devices_column1.push(device)
                        else
                            self.devices_column2.push(device)

                    });
                }).catch(function (error) {
                    console.log(error)
                })
            },

            /**
             * @author ncarmona
             * @description Clear devices list.
             * @version S2
             * @todo add spinner while.
             */
            removeDevicesFromList: function () {
                devices = document.getElementById("devices-list")

                devices.getElementsByClassName("col-md-6")[0].innerHTML = ''
                devices.getElementsByClassName("col-md-6")[1].innerHTML = ''
            },

            /**
             * @author ncarmona
             * @description Filter devices by name.
             * @version S2 - Removed this feature from routes/public.
             * @todo add spinner while.
             * @requires axios
             */
            filterByText: function () {
                if (this.filter_text.length == 0)
                    this.getDevices()
                else if (this.filter_text.length > 0 && this.filter_text.length < 3)
                    console.log("Nothing TO DO")
                else {
                    let self = this
                    setTimeout(function () {
                        // https://ptin2018.herokuapp.com/api/devices/?name=pepito
                        axios.get(self.base_url_api + 'devices/?name=' + self.filter_text).then(function (response) {
                            self.removeDevicesFromList()
                            self.devices = response.data
                            self.devices.forEach(function (device, index) {

                                if (index % 2 == 0)
                                    self.devices_column1.push(device)
                                else
                                    self.devices_column2.push(device)
                            });
                        }).catch(function (error) {
                            console.log(error.message)
                        })
                    }, this.queryDelay)
                }

            },

            /**
             * @author 
             * @description
             * @version 
             */
            filterByType: function () {
                this.removeDevicesFromList()
                console.log("Llamamos AJAX")
            },

            /**
             * @author ncarmona
             * @description Hide sidebar and expand the map layer.
             * @version S2 - Integrated in vuejs with pure js.
             */
            expandMap: function () {
                document.getElementById("sidebar").style.display = "none"
                document.getElementById("content").className = "col-md-12"
                console.log(this.selected_device)
            },

            /**
             * @author ncarmona
             * @description Display the sidebar if the map has been expanded.
             * @version S2
             */
            shrinkMap: function () {
                document.getElementById("sidebar").style.display = "block"
                document.getElementById("content").className = "col-md-6"
            },
            loadMap: function () {
                //Inicialitzate the vectorial layer empty.
                this.vectorLayer = new ol.layer.Vector({
                    name: "vector",
                    source: new ol.source.Vector({
                        features: [

                        ]
                    })

                });


                //Define the style of vectorial layer
                /* this.iconStyle = new ol.style.Style({
                         image: new ol.style.Icon( /** @type {olx.style.IconOptions}**/ /*({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: ''
        }))
    });*/

                //Aply the style to vectorial layer
                //  this.vectorLayer.setStyle(this.iconStyle)


                //Start variable map 
                //Define target (div where map is placed)
                //Define layers (vectorial and Open Street Maps)
                //Define map center, map inital zoom, maxzoom and min zoom
                this.map = new ol.Map({
                    layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), this.vectorLayer],
                    target: document.getElementById('content'),
                    view: new ol.View({
                        projection: 'EPSG:4326',
                        center: [1.7310788, 41.2220107],
                        zoom: this.zoomInicial,
                        minZoom: this.minzm,
                        maxZoom: this.maxzm

                    })
                })

            },
            //Make a request of the Devices in BD and draw all devices then have latitude and longitude.
            drawDevices: function () {
                let self = this

                axios.get(this.base_url_api + 'devices').then(function (response) {
                    self.devices = response.data
                    self.devices.forEach(function (device) {

                        if (device.lastInfo) {
                            let source = self.vectorLayer.getSource();
                            source.addFeature(new ol.Feature({
                                name: device.name,
                                geometry: new ol.geom.Point([device.lastInfo[0].longitude, device.lastInfo[0].latitude])
                            }))
                        }


                    });
                }).catch(function (error) {
                    console.log(error)
                })
            },
            deviceDetail: function (idDevice) {
                document.getElementsByClassName('device').innerHTML=''
                document.getElementById('deviceColu1').style.display='none'
                this.devices_column1=[]
                this.devices_column2=[]
                this.getDevices()

                document.getElementById('deviceColu1').style.display='inherit'
                document.getElementById('deviceColu2').style.display='inherit'
               /* let self=this
               
                
                axios.get(this.base_url_api + 'devices/'+idDevice).then(function (response) {
                    
                self.selected_device=response.data
                let keys=Object.keys(self.selected_device)
               
                keys.forEach(function(k){
                    if((k!="lastInfo")&&(k!="__v")){
                        self.deviceInfo.push(self.atributesTraductionNames[self.atributesNames.indexOf(k)])
                        self.deviceInfo.push(self.selected_device[k])
                        self.deviceAtributes.push(self.deviceInfo)
                        self.deviceInfo=[]
                    }
                })
                
                if(self.selected_device.lastInfo){
                    let keysSensors=Object.keys(self.selected_device.lastInfo)
               
                    keysSensors.forEach(function(k){
                        if(k!="date"){
                            self.deviceInfo.push(self.atributesTraductionNames[self.atributesNames.indexOf(k)])
                            
                            self.deviceInfo.push( self.deviceInfo.push(self.selected_device.lastInfo[k]))
                            self.deviceSensors.push(self.deviceInfo)
                            self.deviceInfo=[]
                        }
                    })
                }
                
                document.getElementById("devices").style.display = "none"
                document.getElementById("filter").style.display = "none"
                document.getElementById("detail").style.display = "inherit"
                })
                
                */
            },
            closeDetaill:function(){
                let self=this
                self.deviceAtributes=[]
                self.deviceInfo=[]
                self.deviceSensors=[]
                document.getElementsByClassName("blocInfo").innerHTML=""
                document.getElementById("detail").style.display = "inherit"
                document.getElementById("devices").style.display = "inherit"
                document.getElementById("filter").style.display = "inherit"
                
            }

        }


    })
})
