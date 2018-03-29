var mongoose = require ('mongoose');
var device = mongoose.model('Device');

// GET - Retorna tots els registres
exports.findAll = function ( req,res) {
	device.find(function(err,devices){
	if(err) res.send(500,err.message);
	res.status(200).jsonp(devices);
	});
};

//GET- Retorna un sol Registre per l'id del dispositiu
exports.findDevice=function(req,res){
	device.find({'id':req.params.id},function(err,Device){
	
	if(err) return res.send(500,err.message);
	if(Device[0]!=null){
		res.status(200).jsonp(Device);
	}else{
		res.status(400).jsonp("No Trobat");
	}
	});
};

//POST - Afegir un nou registre 
exports.add=function(req,res){
	var Device= new device({
		id:req.body.id,		
		name:req.body.name,
		latitude:req.body.latitude,
		longitude:req.body.longitude,
		creationDate:new Date(), //o posem nosaltres
		modificationDate:new Date(), // o posem nosaltres ISO 8601
	});
	//Comprovem que els valors siguien "raonables", si ho son fem el save.
	if (Device.id && Device.name && Device.latitude && Device.longitude){
		Device.save(function(err,Device){
			if(err) return res.send(500,err.message);
			res.status(200).json(Device);
		});
	}else{
		res.status(400).jsonp("Camps NO introduïts correctament");
	}
	
};

//Delete - Elimina un registre per l'id del dispositiu
exports.deleteDevice=function(req, res){
	device.find({'id':req.params.id},function(err, Device){
		if(err) return res.send(500, err.message);
		if(Device[0]!=null){
			Device[0].remove(function(err){
				if(err) return res.send(500,err.message);
				res.status(200).jsonp("Borrat correctament");
			});
		}else{
			res.status(400).jsonp("No Trobat");
		}
	});
};
			

//Delete - Elimina TOTS els registres
exports.borra=function(req,res){
	device.find(function(err,devices){
		if(err) res.send(500,err.message);
		while(devices[0]!=null){
			devices[0].remove(function(err){
				if(err) return res.send(500,err.message);
				});
				devices.shift();
		};
		res.json({message:"Elements borrats correctament"});
	});
};
