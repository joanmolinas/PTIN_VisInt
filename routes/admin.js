/** 
 * This router file contains administration page routes.
 * Routes with .html at the end of the url displays views
 */

var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var bcrypt = require('bcrypt-nodejs')

var default_lang = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'))).language.default_language

 /**
 * @author ncarmona
 * @description this is /admin. if user has been validated will redirect to dashboard, otherwhise will 
 * display admin login.
 * @version S1
 */
router.get('/', function(req, res, next){
  // if user session exists -> redirect to dashboard.
  // else redirect to admin login.

   res.redirect('/admin/login.html')
  // res.redirect('/dashboard.html')
})

 /**
 * @author ncarmona
 * @description Display admin login.
 * @version S1
 */
router.get('/login.html', function(req, res, next) {

  let user = require('../models/User')
  var trans = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lang', default_lang, 'admin.json')))

  res.render('login-admin', {
    'trans': trans.login, //Contains language strings.
    'content': "" //Data that will be displayed
  })
})

 /**
 * @author ncarmona
 * @description Looks for a user with req.body.username and then compare req.body.password with user password..
 * @version S1
 * @requires bcrypt-nodejs 
 * @returns 
 */
router.post('/auth', function(req, res, next){
  let user = require('../models/User')

  // Looking for username (req.body.username).
  user.findOne({'nombre': req.body.username}, "" ,function(err, users_doc){

    // if user exists let's compare hash db with hash form.
    if(bcrypt.compareSync(req.body.pwd, users_doc.clave)){
      res.json({
        "status": "ok",
        "msg": "Succefully validated.",
      })

    // Creating session variables.
    }else{
      res.json({
        "stauts": "err",
        "msg": "Invalid username or password"
      })
    }
  })
})

/**
 * Close current user session.
 */
router.get('/logout', function(req, res, next){
  //if session variable exists we will delete them.

  //Otherwhise do nothing.
})

/**
 * display admin dashboard (main admin page).
 */
router.get('/dashboard.html', function(req, res, next){
  // if session user variable exists -> render dashboard view.
  // else redirect to /admin/login.html
})

module.exports = router;
