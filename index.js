const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

// Load all the local modules
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

// Define app
const app = express();

// Middlewares:
// use body-parser to get requests as json
app.use(bodyParser.json());
// config cookie
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}));
// init passport and force app to use passport's session in 'req.session'
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// Import Routes
require('./routes/auth')(app);


// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true })
  .then(() => {   console.log("********** connected to mLAB **********") })
  .catch(err => console.log(err));



// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {console.log("************** Server Started... ***************")});