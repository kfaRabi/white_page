const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const expressHandlebars = require('express-handlebars');
const path = require('path');

// Load all the local modules
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

// Define app
const app = express();

// Middlewares:
// Use body-parser to get requests as json
app.use(bodyParser.json());
// Config cookie
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}));
// Init passport and force app to use passport's session in 'req.session'
app.use(passport.initialize());
app.use(passport.session());
// Define local variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// setup static folder
app.use(express.static(path.join(__dirname, 'public')));
// Use handlebars as templating engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'master',
}));
app.set('view engine', 'handlebars');

// Define Routes
app.get('/', (req, res) => {
  res.render("index");
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