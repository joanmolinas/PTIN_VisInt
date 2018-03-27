var mongoose = require ('mongoose');
var device = mongoose.model('Device');
// GET - Retorna tots els registres
exports.findAll = function ( req,res) {
	device.find(function(err,devices){
	if(err) res.send(500,err.message);
	res.status(200).jsonp(devices);
	});
};
//Get- Retorna un sol Registre
exports.findDevice=function(req,res){
	device.find({'name':req.params.name},function(err,device){
	if(err) return res.send(500,err.message);
	res.status(200).jsonp(device);
	});
};

//POST insrtar un nou registre 
exports.add=function(req,res){
	var Device= new device({
		id:req.body.id,		
		name:req.body.name,
		latitude:req.body.latitude,
		longitude:req.body.longitude,
		creationDate:req.body.creationDate,
		modificationDate:req.body.modificationDate,
	});
	Device.save(function(err,Device){
		if(err) return res.send(500,err.message);
		res.status(200).json(Device);
	});
};
		
//Delete borra tots els registres
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
