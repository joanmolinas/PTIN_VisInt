/**
 * This router file contains administration page routes.
 * Routes with .html at the end of the url displays views
 */

var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var bcrypt = require('bcrypt-nodejs')
var user = require('../models/User')

var default_lang = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'))).language.default_language


////Display admin dashboard (main admin page).
router.get('/', function(req, res, next){
  if (!req.session.user){
    res.redirect('/admin/login.html')
  }
  else{
    res.render('/dashboard.html')
  }
})

//Display admin login.
router.get('/login.html', function(req, res, next) {

  var trans = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lang', default_lang, 'admin.json')))

  res.render('login-admin', {
    'trans': trans.login, //Contains language strings.
    'content': "" //Data that will be displayed
  })
})

//Looks for a user with req.body.username and then compare req.body.password with user password.
router.post('/auth', function(req, res, next){

  // Looking for username (req.body.username).
  user.findOne({'nombre': req.body.username}, "" ,function(err, users_doc){

    // if user exists let's compare hash db with hash form.
    if(bcrypt.compareSync(req.body.pwd, users_doc.clave)){
      res.status(200).send({'message': 'Succesfully validated'})

    // Creating session variables.
    }else{
      res.status(401).send({'message': 'Error. Invalid username or password'})
    }
  })
})

//Close current user session.
router.get('/logout', function(req, res, next){
  if (req.session.user){
    req.session.destroy();
    res.status(200).send({'message': 'Succesfully logout'})
  }
  else{
    res.status(401).send({'message': 'You are already logged out'})
  }
})

//Display admin dashboard (main admin page).
router.get('/dashboard.html', function(req, res, next){
  if (!req.session.user){
    res.redirect('/admin/login.html')
  }
  else{
    res.render('/dashboard.html')
  }
})

module.exports = router;
