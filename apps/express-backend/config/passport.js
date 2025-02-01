const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const users = require('../models').users;
const dotenv = require('dotenv-safe');

const envFound = dotenv.config();
if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const config = require('../config/config.json');
const env = config[process.env.ENV];

module.exports = function (passport) {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.JWT_SECRET;
    passport.use(new JwtStrategy(opts, ((jwtPayload, done) => users.findOne({
        where: {
            id: jwtPayload.id,
        },
    })
        .then((user) => {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch((error) => {
            done(null, false);
        }))));
};
