var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var bcrypt = require('bcrypt-nodejs')
var app = express();

var default_lang = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'))).language.default_language

mongoose.connect('mongodb://localhost/devices', function(err, res){
  if (err) console.log('ERROR: Conectant a la BD: ' +err);
  else console.log('Connexió amb la BD realitzada');
});

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.router);
});

app.get('/', function(req, res){
  res.send ('Hola, Mundo!');
});

//Port o surta a on hem d'escoltar
app.listen(5000);
module.exports = router;
console.log('Listening');