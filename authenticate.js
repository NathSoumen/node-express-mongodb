const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken');

let config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn:3600});
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.JwtPassport = passport.use(new JwtStrategy(opts,
    function(jwt_payload, done){
        console.log("jwt_payload ", jwt_payload);
        User.findOne({_id:jwt_payload._id}, (err, user) => {
            if(err) {
                return done(err, false)
            } 
            else if(user){
                return done(null, user)
            } else {
                return done(null, false);
            }
        })
    }));

exports.verifyUser = passport.authenticate('jwt', {session:false});
exports.verifyAdmin = function(req, res, next) {
    User.findOne({_id:req.user._id}, (err, user) => {
        // console.log(req.user)
        if(err) {
            var err = new Error("You are not authorised to this !!!");
            err.statusCode = 403;
            next(err);
        } else if(user.admin === true) {
                return next()        
        } else {
            var err = new Error("You are not authorised to this !!!");
            err.statusCode = 403;
            next(err);
        }
    })

}
