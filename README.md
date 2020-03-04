# Project Jupiter

A website project for cs 3308!

## Change-Log
Date         | What's new
------------ | -------------
(2/28) | I added a .gitignore. If you look inside it there is an ignore for .env files. This is where the process.env.VARIABLE's are coming from. Shoot me a text and I can tell you how to set    those up.
(3/4) | Added an openweather field in the env file. Created a seperate page for user registration and some form validation. User is now logged in once they register for an account. Made a mock post route for getting weather data from openweather, currently it only gets data for the city of London.
(3/4) ext. | Added Google Maps Direction API test route (it works!), and added two buttons on the main page to test the routes.Also did some refactoring of the register route for a crash, and some logic for which warnings are more important (for example: password match vs password empty, which to show?). Also added some documenation using JSdoc styling.

## Getting up and running:
1. Clone this repo
2. In your terminal type 'npm install'
3. To run the server type 'npm start'

## Asides:
* The express server can found in server.js, it has a lot of comments explaining what everything does.
* EJS is just a templating engine, I think it might be a pretty simple thing to use, so look it up, but this can be easily swapped for something else right now!
* nodemon is running, so if the server is running and you make any changes to server.js it will automatically restart.
* Stop the server with 'ctrl + C' if in linux
* Text me if you have questions.
* Please run 'npm install' everytime you pull just incase extra dependencies were installed since the last time you pulled.
* 'killall node' might help if you cannot connect to localhost but the server is running
