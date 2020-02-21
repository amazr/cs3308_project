/* Define node requirements and set app */
var express = require('express');
var app = express();

/* Sets the view engine to ejs, this is just an html templating thing. */
app.set('view engine', 'ejs');

/* 
    When the user loads the base url they will be served index.html, which can be found in views/pages/ 
    Express is already looking for render files in the views folder, so no need to specify that         
*/
app.get('/', (req,res) => {
    res.render('pages/index');
})

/* App is running on port 3000 */
app.listen(3000);
console.log("Server running on localhost:3000");