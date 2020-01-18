var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const passport = require('passport');
const  authenticated = require('../authenticate')
const cors = require('./cors')
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/',cors.corsWithOptions,authenticated.verifyUser,authenticated.verifyAdmin, function(req, res, next) {
  User.find({}, (err, users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ users: users })
  });
});

router.post('/signup',cors.corsWithOptions, function(req,res,next) {
   User.register(new User ({username: req.body.username}),
    req.body.password, (err, user) =>  {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    } else {
        if(req.body.firstname) 
          user.firstname = req.body.firstname;
        
        if(req.body.lastname) 
          user.lastname = req.body.lastname;
        
        user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
            return
          }
          passport.authenticate('local')(req,res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true,status: 'registration successful!'})
          });
        });

    }
   })
 });

router.post('/login',cors.corsWithOptions, passport.authenticate('local'), function(req,res) {

      let token = authenticated.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true, token:token, status: 'You are successfully logged in !!!'})
});

router.get('/logout', (req,res) => {
    if(req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      var err = new Error("You are not logged in!");
      err.statusCode = 403;
      next(err);
    }
})


module.exports = router;
