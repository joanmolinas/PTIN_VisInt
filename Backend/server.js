var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

//Coneccio DB
mongoose.connect('mongodb://localhost',function(err, res){
	if(err)throw err;
	console.log('Connectat a la base de dades');
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Importar models i routes
var models = require('./models/device')
app.use(express.static(__dirname+'/public'));
var device = require('./routes/devices');

//Api routes
var api=express.Router();

api.route('/devices')
	.get(device.findAll)
	.post(device.add)
	.delete(device.borra);
api.route('/devices/:id')
	.get(device.findDevice)
	.delete(device.deleteDevice);

app.use('/api',api);

//Inicialitzar Servidor
app.listen(3000,function(){
	console.log("Node server running on http://localhost:3000");
});

