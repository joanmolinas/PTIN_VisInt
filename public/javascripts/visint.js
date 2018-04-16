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
            device_type: '',
            queryDelay: 1000,
            zoomInicial: 17,
            maxzm: 20,
            minzm: 17,
            vectorLayer: '',
            iconstyle: '',
            map: '',
            min_length_filter: 3,
            debug: true
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

                    self.devices.filter(function(device) {
                        return device.lastInfo != null || device.lastInfo != undefined
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
             * @version S2
             * @todo add spinner while. Filter by specified field.
             */
            filterByText: function(){
                if (this.filter_text.length == 0){
                    this.removeDevicesFromList()
                    this.filterByType()
                } else if (this.filter_text.length > 0 && this.filter_text.length < this.min_length_filter)
                    console.log ("Nothing TO DO")
                else{
                    let self = this
                    setTimeout(function(){
                        let query = self.base_url_api + 'devices/?'

                        if(self.filter_text.length >= self.min_length_filter){
                            query += 'name=' + self.filter_text
                        }
                        if(self.device_type.length > 0)
                            query += '&type=' + self.device_type

                        if(self.debug) console.log(query)

                        axios.get(query).then(function(response){
                            self.removeDevicesFromList()
                            self.devices = response.data

                            self.devices.forEach(function(device, index){
                                if(index % 2 == 0)
                                    self.devices_column1.push(device)
                                else
                                    self.devices_column2.push(device)
                            });
                        }).catch( function(error){
                            console.log(error.message)
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
            filterByType: function(){

                this.removeDevicesFromList()
                let self = this
                let query = this.base_url_api + 'devices/?'

                if(this.device_type.length > 0)
                    query += 'type=' + this.device_type

                if(this.filter_text.length >= this.min_length_filter){
                    if (query.slice(-1) != '?')
                        query+='&'
                    query += 'name=' + this.filter_text
                }

                if (this.debug) console.log(query)

                axios.get(query).then(function(response){
                    self.removeDevicesFromList()
                    self.devices = response.data
                    self.devices.forEach(function(device, index){

                        if(index % 2 == 0)
                            self.devices_column1.push(device)
                        else
                            self.devices_column2.push(device)
                    });
                }).catch( function(error){
                    console.log(error.message)
                })
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

                        if(device.lastInfo){
                            let source=self.vectorLayer.getSource();
                            source.addFeature(new ol.Feature({
                                name:device.name,
                                geometry: new ol.geom.Point([device.lastInfo[0].longitude,device.lastInfo[0].latitude])
                            }))
                        }


                    });
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    })
})
