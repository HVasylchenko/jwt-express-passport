const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()
const { secretAccess, secretRefresh } = require("../configJWT");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretAccess
// console.log('opts', opts)
const mongoose = require('mongoose')
// const User = mongoose.model('User')
const User = require("../modelsMongoDB/user-model");
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done)=> {
    const user = await User.findById(jwt_payload.userId).select('id id_type')
   
        if (user) {         
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }))
}