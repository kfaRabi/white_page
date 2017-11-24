const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20');

const keys = require('../config/keys');
const User = mongoose.model('users');

// create session using 'user.id'
passport.serializeUser( (user, done) => {
  done(null, user.id);
});
// get user from session
passport.deserializeUser( async (googleID, done) => {
  const user = await User.findOne({ googleID });
  done(null, user);
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/oauth/google/callback',
    proxy: true,
  },
  async (accessTocken, refreshTocken, profile, done) => {
    const googleID = profile.id;
    
    // Check if an User with this googleID already exists.
    let user = await User.findOne({ googleID });

    // If yes, then call 'serialize(done)' with 'no error(null)' and 'user'
    if(user){
      done(null, user);
    }
   // Otherwise, create a new user with the credentials and then call serialize
    else{
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
      
      user = new User({
        googleID, email, firstName, lastName, image
      });
      
      const newUser = await user.save();
      done(null, newUser);
    }
  })
);