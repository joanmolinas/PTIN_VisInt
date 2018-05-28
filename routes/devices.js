express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-Information')
router = express.Router()
socket = require("../handlers/socket-handler")
service = require("../handlers/token-service")

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
    	if (!device.enabled){
    		res.status(400).send({"message": 'Device is not enabled'})
    		return
        }
        
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
