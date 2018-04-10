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
            zoomInicial: 18,
            maxzm: 20,
            minzm: 17,
            vectorLayer: '',
            iconstyle: '',
            map: ''
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
                    self.devices.forEach(function (device, index) {
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
                //Crea capa vectorial, amb dos Features que son dos punts geometrics
                this.vectorLayer = new ol.layer.Vector({
                    name: "vector",
                    source: new ol.source.Vector({
                        features: [
                           
                        ]
                    })

                });


                //Defineix l'estil del punt que col·loquem al mapa.
                /*this.iconStyle = new ol.style.Style({
                        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */// ({
			    /*	anchor: [0.5, 46],
			    	anchorXUnits: 'fraction',
			    	anchorYUnits: 'pixels',
			    	opacity: 0.75,
			    	src: 'icon.png'
	    		}))
    		});*/

                //Apliquem l'estil a la capa vectorial
                //point.setStyle(iconStyle)


                //Crea variable mapa, amb dues capes una capa amb el mapa OSM i la capa vectorial
                //Defineix targer (contenidor de l'HTML on es situa el mapa)
                //Defineix la vista del mapa, tipus de sistema de cordenades centre del mapa (coordenades que estaran al centre), zoom inicial, zoom minim i zoom maxim
                this.map = new ol.Map({
                    layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), this.vectorLayer],
                    /*interactions:ol.interaction.defaults({
                        doubleClickZoom: false,
                        mouseWheelZoom: false,
                        keyboardZoom: false
                    }),*/
                    /*controls: ol.control.defaults({
                  zoom: false,
                  attribution: false,
                  rotate: false
                      }),*/
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
            drawDevices: function () {
                let self = this

                axios.get(this.base_url_api + 'devices').then(function (response) {
                    self.devices = response.data
                    self.devices.forEach(function (device) {
                        console.log(device.latitude)
                        let source=self.vectorLayer.getSource();
                        source.addFeature(new ol.Feature({
                            name:device.name,
                            geometry: new ol.geom.Point([device.latitude,device.longitude])
                        }))
                        

                    });
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    })
})
