const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(new LocalStrategy(
    function(email, password, done) {
      return done(null, {email: email});
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(err, {});
  });
};
