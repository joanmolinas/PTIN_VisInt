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
	var mitjana = 5;


	let data = new Date();


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
				//console.log('hola')
				if(dev.lastInfo!=null) {
					console.log(dev.lastInfo.temperature)
					mitjana = (mitjana + dev.lastInfo.temperature)/2
					console.log(mitjana)
				}
			}
		})
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

router.get('/hum', function(req, res, next){

	// array per guardar els diccionaris
	var arrayHum = [];

	// mitjana de temperatura, igual per a tots els diccionaris
	var mitjana = 5;


	let data = new Date();


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
				//console.log('hola')
				if(dev.lastInfo!=null) {
					console.log(dev.lastInfo.temperature)
					mitjana = (mitjana + dev.lastInfo.temperature)/2
					console.log(mitjana)
				}
			}
		})
		arrayHum.push(dic8)
		arrayHum.push(dic10)
		arrayHum.push(dic12)
		arrayHum.push(dic14)
		arrayHum.push(dic16)
		arrayHum.push(dic18)
		arrayHum.push(dic20)
		arrayHum.push(dic22)
	})
    .then(doc => {
        res.status(200).send(arrayHum)
    })
    .catch(e => {
        res.status(500).send('Something went wrong')
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
    
    return 
    Promise.all([
        Device.findById(req.params.id).select(filter),
        DeviceInformation.findOne({'id_device': req.params.id}, {'info': {'$slice': -1}})
    ]).then(([device, information]) => {
        if (information) { device.lastInfo = information.info[0] }
        res.send(device)
    }).catch(e => {
        console.log(e);
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
    delete query.size
    delete query.page

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

    if (Object.keys(query).length !== 0) {
        query.lastInfo = { $elemMatch: req.body}
    }

    let prom = Device.paginate(query, {page: page, limit: size, sort: { modificationDate: -1}, select: filter})
    .then(docs => {
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
