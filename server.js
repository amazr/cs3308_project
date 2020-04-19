  /* App requirements section */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/routes');
const session = require('express-session');
const bodyParser= require('body-parser');

/* Declare express app */
const app = express();

/* App use section */
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    'secret': process.env.SECRET,
    saveUninitialized: true,
    resave: false
}));
app.use(express.static('resources'))
app.use(routes);

/* Connect to mongoDB, throw errors to console */
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Sets the view engine to ejs, this is just an html templating thing. */
app.set('view engine', 'ejs');

/* App is running on port 3000 */
app.listen(8080, () => {
    console.log("Server running on localhost:8080");
});