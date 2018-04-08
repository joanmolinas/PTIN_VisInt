window.addEventListener('load', function(){
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
            queryDelay: 1000            
        },
        mounted: function(){
            return this.getDevices()
        },
        methods: {
            /**
             * @author ncarmona
             * @description Get all devices and print them in right and left column at the sidebar.
             * @version S2 - Removed this feature from routes/public.
             * @todo add spinner while 
             */
            getDevices: function(){
                let self = this
                
                axios.get(this.base_url_api + 'devices').then(function(response){
                    self.devices = response.data
                    self.devices.forEach(function(device, index){
                        if(index % 2 == 0)
                            self.devices_column1.push(device)
                        else
                            self.devices_column2.push(device)
                        
                    });
                }).catch( function(error){
                    console.log(error)
                })
            },

            /**
             * @author ncarmona
             * @description Clear devices list.
             * @version S2
             * @todo add spinner while.
             */            
            removeDevicesFromList: function(){
                devices = document.getElementById("devices-list")
        
                devices.getElementsByClassName("col-md-6")[0].innerHTML=''
                devices.getElementsByClassName("col-md-6")[1].innerHTML=''                
            },

            /**
             * @author ncarmona
             * @description Filter devices by name.
             * @version S2 - Removed this feature from routes/public.
             * @todo add spinner while.
             * @requires axios
             */            
            filterByText: function(){
                if (this.filter_text.length == 0)
                    this.getDevices()
                else if (this.filter_text.length > 0 && this.filter_text.length < 3)
                    console.log ("Nothing TO DO")
                else{
                    let self = this
                    setTimeout(function(){
                        // https://ptin2018.herokuapp.com/api/devices/?name=pepito
                        axios.get(self.base_url_api + 'devices/?name=' + self.filter_text).then(function(response){
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
             * @author 
             * @description
             * @version 
             */            
            filterByType: function(){
                this.removeDevicesFromList()
                console.log ("Llamamos AJAX")                
            },

            /**
             * @author ncarmona
             * @description Hide sidebar and expand the map layer.
             * @version S2 - Integrated in vuejs with pure js.
             */            
            expandMap: function(){
                document.getElementById("sidebar").style.display = "none"
                document.getElementById("content").className = "col-md-12"  
                console.log(this.selected_device)              
            },

            /**
             * @author ncarmona
             * @description Display the sidebar if the map has been expanded.
             * @version S2
             */            
            shrinkMap: function(){
                document.getElementById("sidebar").style.display = "block"
                document.getElementById("content").className = "col-md-6"                
            }
        }
    })
})