const Users = require("../model/user");
const passport = require("passport");

const jwt = require("jsonwebtoken");

const passportLocalStrategy = require("passport-local").Strategy;
const passportJWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

require('dotenv').config({ path:'./config.env' });

var options = {};

passport.use(new passportLocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

exports.getToken = function(user) {
  return jwt.sign(user,process.env.SECRET, { expiresIn: '1d', });
};

passport.use(
  new passportJWTStrategy(options, (jwt_payload, done) => {
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        done(err, false);
      }
      if (user) done(null, user);
      else {
        done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate('jwt',{ session: false });