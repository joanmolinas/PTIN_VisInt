express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-Information')
router = express.Router()
socket = require("../handlers/socket-handler")
service = require("../handlers/token-service")


router.get('/temp', function(req, res, next){

    // array per guardar els diccionaris
    var array = [];

    // mitjana de temperatura, igual per a tots els diccionaris
    var mitjana = 0;

    var compta8 = 0;
    var compta10 = 0;
    var compta12 = 0;
    var compta14 = 0;
    var compta16 = 0;
    var compta18 = 0;
    var compta20 = 0;
    var compta22 = 0;

    let data_avui = new Date();
    var dia = data_avui.getDate();
    var mes = data_avui.getMonth()+1; //January is 0!
    var any = data_avui.getFullYear();
    var now = data_avui.getHours();
    var minut = data_avui.getMinutes();


    // tenim 8 diccionaris, dic8 = 8 del mati, dic10 = 10 del mati, etc
    var dic8 = {
        x:mitjana,
        y:"8:00"
    };

    var dic10 = {
        x:mitjana,
        y:"10:00"
    };

    var dic12 = {
        x:mitjana,
        y:"12:00"
    };

    var dic14 = {
        x:mitjana,
        y:"14:00"
    };

    var dic16 = {
        x:mitjana,
        y:"16:00"
    };

    var dic18 = {
        x:mitjana,
        y:"18:00"
    };

    var dic20 = {
        x:mitjana,
        y:"20:00"
    };

    var dic22 = {
        x:mitjana,
        y:"22:00"
    };

    // get de tots els dispositius de temperatura
    Device.find({}, function(err, devices) {
        devices.forEach(function(dev){
            // ok, torna tots els tipus 5
            if(dev.type == 5){
            	dia_mod = dev.modificationDate.getDate();
            	mes_mod = dev.modificationDate.getMonth()+1;
            	any_mod = dev.modificationDate.getFullYear();
            	// hem modificat avui, comparem dia mes i any
                if(dia == dia_mod && mes == mes_mod && any == any_mod){
                    if(dev.lastInfo!=null && dev.enabled == true) {
                        if(dev.lastInfo.temperature!=null){
                            // ara tenim un dispositiu enabled que te temperatura i s'ha modificat avui
                            // si s'ha modificat abans de les 8 sumem la temperatura al diccionari de les 8
                            hora = dev.modificationDate.getHours();
                            minuts = dev.modificationDate.getMinutes();
                            //console.log('hora de modificacio', minuts)
                            //console.log(dev.modificationDate)
                            if(hora < 8 && now >= 8) {
                            	compta8++
                            	dic8.x = dic8.x + dev.lastInfo.temperature
                            }

                            // la darrera modificacio sa fet entre les 8 i les 10
                            else if((hora >= 8 && minuts <= 59) && hora < 10 && now >= 10) {
                            	compta10++
                            	dic10.x = dic10.x + dev.lastInfo.temperature
                            }
                            // 10 a 12
                            else if((hora >= 10 && minuts <= 59) && hora < 12 && now >= 12) {
                            	compta12++
                            	dic12.x = dic12.x + dev.lastInfo.temperature
                            }
                            // 12 a 14
                            else if((hora >= 12 && minuts <= 59) && hora < 14 && now >= 14) {
                            	compta14++
                            	dic14.x = dic14.x + dev.lastInfo.temperature
                            }
                            // 14 a 16
                            else if((hora >= 14 && minuts <= 59) && hora < 16 && now >= 16) {
                            	compta16++
                            	dic16.x = dic16.x + dev.lastInfo.temperature
                            }
                            // 16 a 18
                            else if((hora >= 16 && minuts <= 59) && hora < 18 && now >= 18) {
                            	compta18++
                            	dic18.x = dic18.x + dev.lastInfo.temperature
                            }
                            // 18 a 20
                            else if((hora >= 18 && minuts <= 59) && hora < 20 && now >= 20) {
                            	compta20++
                            	dic20.x = dic20.x + dev.lastInfo.temperature
                            }
                            // 20 a 22
                            else if((hora >= 20 && minuts <= 59) && hora < 22 && now >= 22) {
                            	compta22++
                            	dic22.x = dic22.x + dev.lastInfo.temperature
                            } 
                        }
                    }
                }
            }    
        })

        // calculem mitjanes

        // fer mitjana a cada diccionari

        dic8.x = dic8.x/compta8
        dic10.x = dic10.x/compta10
        dic12.x = dic12.x/compta12
        dic14.x = dic14.x/compta14
        dic16.x = dic16.x/compta16
        dic18.x = dic18.x/compta18
        dic20.x = dic20.x/compta20
        dic22.x = dic22.x/compta22

        array.push(dic8)
        array.push(dic10)
        array.push(dic12)
        array.push(dic14)
        array.push(dic16)
        array.push(dic18)
        array.push(dic20)
        array.push(dic22)
    })
    .then(doc => {
        res.status(200).send(array)
    })
    .catch(e => {
        res.status(500).send('Something went wrong')
    })

})

router.get('/stadistics', function(req, res, next){
	
    //Inicialitzem Arrays a 0
    var ArrayA = [];
    for (i=0;i<8;i++) ArrayA[i] = 0;
    
    var ArrayB = [];
    for (i=0;i<8;i++) ArrayB[i] = 0;
    
    var ArrayNea = [];
    for (i=0;i<8;i++) ArrayNea[i] = 0;
    
    var ArrayExterior = [];
    for (i=0;i<8;i++) ArrayExterior[i] = 0;

	Device.find({}, function(err, devices) {
		devices.forEach(function(dev){
			if (dev.lastInfo!=null){
				if(dev.lastInfo.edificio == "A"){
				    ArrayA[0]++;
				    if(dev.active) ArrayA[1]++;
				    ArrayA[dev.type+1]++
				}
	            else if(dev.lastInfo.edificio == "B") {
	                ArrayB[0]++;
	                if(dev.active) ArrayB[1]++;
	                ArrayB[dev.type+1]++
	            }
	            else if(dev.lastInfo.edificio == "Neapolis") {
	                ArrayNea[0]++;
	                if(dev.active) ArrayNea[1]++;
	                ArrayNea[dev.type+1]++
	            }
	            else {	
                    console.log("elseee")
	                ArrayExterior[0]++;
	                if(dev.active) ArrayExterior[1]++;
	                ArrayExterior[dev.type+1]++
	            }
			}
        })

    	var edificiA = {
			total: ArrayA[0],
			actius: ArrayA[1],
			1: ArrayA[2],
			2: ArrayA[3],
	        3: ArrayA[4],
	        4: ArrayA[5],
	        5: ArrayA[6],
	        6: ArrayA[7]
		};
	    var edificiB = {
	        total: ArrayB[0],
	        actius: ArrayB[1],
	        1: ArrayB[2],
	        2: ArrayB[3],
	        3: ArrayB[4],
	        4: ArrayB[5],
	        5: ArrayB[6],
	        6: ArrayB[7]
	    };
	    var edificiNea = {
	        total: ArrayNea[0],
	        actius: ArrayNea[1],
	        1: ArrayNea[2],
	        2: ArrayNea[3],
	        3: ArrayNea[4],
	        4: ArrayNea[5],
	        5: ArrayNea[6],
	        6: ArrayNea[7]
	    };
	    var exterior = {
	        total: ArrayExterior[0],
	        actius: ArrayExterior[1],
	        1: ArrayExterior[2],
	        2: ArrayExterior[3],
	        3: ArrayExterior[4],
	        4: ArrayExterior[5],
	        5: ArrayExterior[6],
	        6: ArrayExterior[7]
        };
        let result = {
            "Edifici A": edificiA,
            "Edifici B": edificiB,
            "Neàpolis": edificiNea,
            "Exterior": exterior

        }
        res.status(200).send(result)	
	})
    .catch(e => {
        res.status(500).send('Internal server error')
    })
})

router.get('/:id', function(req, res, next){
    
    if(req.params.id == 'count') { 
        next()
        return
    }

    let query = url.parse(req.url, true).query
    let dict = {}
    let filter = ''
    if (query.fields) {
        let arr = query.fields.replace("[",'').replace("]",'').split(',') //TODO: Improve it, this is a shit
        filter = arr.join('')
    }

    Device.findById(req.params.id).select(filter)
    .then(dev => {
        if (!dev) res.status(404).send({message: "device doesn't exists"})
        else res.status(200).send(dev)
    })
    .catch(e => {
        res.status(500).send({message: 'Internal server error'})
    })
})

router.get('/count', (req, res, next) => {
    let size = req.query.size || 20
    console.log(size)
    Device.find().count()
    .then(doc => {
        res.status(200).send({count: Math.round(doc/size)})
    })
    .catch(e => {
        res.status(500).send('Internal server errorxw')
    })
})

router.get('/', function(req, res, next){
    let query = url.parse(req.url, true).query
    let size = parseInt(query.size || 20)
    let page = parseInt(query.page || 1)
    let paginated = query.paginated || 'true'

    
    delete query.size
    delete query.page
    delete query.paginated

    if (query.name) {
        let regexp = new RegExp("^"+ query.name, "i");
        query.name = regexp
    }
    let filter = ''
    if (query.fields) {
        let arr = query.fields.replace("[",'').replace("]",'').split(',') //TODO: Improve it, this is a shit
        filter = arr.join('')
        delete query.fields
    }

    let prom;
    if (paginated == 'true') {
        prom = Device.paginate(query, {page: page, limit: size, sort: { modificationDate: -1}, select: filter})
    } else {
        prom = Device.find(query).sort({modificationDate: -1}).select(filter)
    }

    prom.then(docs => {
        res.status(200).send(docs)
    })
    .catch(e => {
        console.log(e)
        res.send({"status": "400"})
  })
})

router.post('/', function(req, res, next) {
    let name = req.body.name
    let creationDate = new Date()
    let modificationDate = new Date()
    let type = req.body.type

    if (!name || !type) {
        res.status(400).send({"message": 'ERROR Fields missing'})
    	return
    }

    let device = new Device({
        name: name,
        active: true,
        type: type,
        creationDate: creationDate,
        modificationDate: modificationDate,
        deleted: false,
        enabled: false
    })
    device.save()
    .then(device => {
    	let tok = service.createToken(device)
    	device.token = tok
    	device.save()
        res.send({"status": 201, "id": device._id, "token": device.token})
        socket.deviceWasUpdated()
    }).catch(e => {
        res.send({"status": 400})
    })
})

router.put('/:id/info', service.ensureDeviceAuthenticated, function(req, res, body) {
    if (!req.body) {
    	res.status(400).send({"message": 'ERROR Fields missing'})
    	return
    }

    let modificationDate = new Date()
    req.body.date = modificationDate

    Device.findByIdAndUpdate(req.params.id,{
        $set: {
            modificationDate: modificationDate
        }
    })
    .then(device => {
    	// if (!device.enabled){
    	// 	res.status(400).send({"message": 'Device is not enabled'})
    	// 	return
        // }
        
        DeviceInformation.findOneAndUpdate({'id_device': device._id}, {
            $push: {
                info: req.body
            }
        })
        .then(doc => {
            if (!doc) {
                let schema = new DeviceInformation({ id_device: req.params.id, info: [ req.body ] })

                schema.save()
                .then(doc => {
                    device.lastInfo = req.body;
                    device.save()
                    res.status(201).send({'message': 'Information added to device'})
                    socket.deviceWasUpdated()
                })
                .catch(e => {
                    res.status(500).send({'message': 'Internal server error'})
                })
            } else {
                device.lastInfo = req.body;
                device.save()
                res.status(200).send({'message': 'Device information updated'})
                socket.deviceWasUpdated()
            }
        })
        .catch(e => {
            res.status(500).send({'message': 'Internal server error'})
        })
    })
    .catch(e => {
        res.status(500).send({'message': 'Internal server error'})

    })
})

router.put('/:id', service.ensureDeviceAuthenticated, function(req, res, body) {

    if (!req.body ) {
        res.status(400).send({"message": 'ERROR Fields missing'})
        return
    }

    Device.findByIdAndUpdate(req.params.id,{
        $set: {
        	modificationDate: new Date(),
            enabled: req.body.enabled,
            deleted: req.body.deleted
        }
    })
    .then(doc => {
    	socket.deviceWasUpdated()
    	res.status(200).send({"message": 'OK: Device Changed '})
    })
    .catch(e => {
    	res.status(400).send({"message": 'ERROR Something went wrong'})
    	return
  })
})

router.get('/:id/delete', function(req, res, next){
  Device.findByIdAndRemove(req.params.id)
  .then(doc => {
      res.send({'status': 200})
  })
  .catch(e => {
      res.send({'status': 400})
  })
})

router.post('/:id/shutdown', (req, res, next) => {
    socket.emitShutdown(req.params.id)
    res.status(200).send({message: 'shutdown sent'})
})
module.exports = router
