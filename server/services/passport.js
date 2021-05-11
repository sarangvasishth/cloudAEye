const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRECT,
};

const jwtLogin = new JwtStrategy(options, async function (payload, done) {
  try {
    const { userId } = payload;
    const user = await User.findById({ _id: userId });

    if (!user) {
      return done(null, false, { message: "Unable to find such user." });
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(jwtLogin);
