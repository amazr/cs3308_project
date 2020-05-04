  /* App requirements section */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/routes');
const tests = require('./routes/tests');
const session = require('express-session');
var MemcachedStore = require('connect-memjs')(session);
const bodyParser= require('body-parser');

/* Declare express app */
const app = express();

/* App use section */
app.use(bodyParser.urlencoded({extended: true}));


if (process.env.MODE == "dev")
{
  app.use(session({
    'secret': process.env.SECRET,
    resave: 'true',
    saveUninitialized: 'false',
  }));
}
else if (process.env.MODE == "prod")
{
  app.use(session({
    'secret': process.env.SECRET,
    resave: 'false',
    saveUninitialized: 'false',
    store: new MemcachedStore({
      servers: [process.env.MEMCACHIER_SERVERS],
      prefix: '_session_'
    })
  }));
}

app.use(express.static('resources'))
app.use(routes);
app.use(tests);

/* Connect to mongoDB, throw errors to console */
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Sets the view engine to ejs, this is just an html templating thing. */
app.set('view engine', 'ejs');

/* App is running on port 3000 */
app.listen(process.env.PORT, () => {
    console.log("Server running on port:" + process.env.PORT + " in '" + process.env.MODE + "' mode");
});

module.exports = app