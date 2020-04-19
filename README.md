# Project Jupiter
A website project for cs 3308!

## Change-Log
Date         | What's new
------------ | -------------
2/28 | I added a .gitignore. If you look inside it there is an ignore for .env files. This is where the process.env.VARIABLE's are coming from. Shoot me a text and I can tell you how to set    those up.
3/4 | Added an openweather field in the env file. Created a seperate page for user registration and some form validation. User is now logged in once they register for an account. Made a mock post route for getting weather data from openweather, currently it only gets data for the city of London.
3/4 ext. | Added Google Maps Direction API test route (it works!), and added two buttons on the main page to test the routes.Also did some refactoring of the register route for a crash, and some logic for which warnings are more important (for example: password match vs password empty, which to show?). Also added some documenation using JSdoc styling.
3/5 | Added a search bar that is hooked up to Google Places API. It populates a list of locations and displays them under the search bar. Each location has a green button that will allow you to add that card to your list (I think logged out users should only have access to one dynamic list). This is a first pass, might pivot off Google Places here, who knows, agile and all.
3/6 | Added basic structure and server response for cards. Only provides current weather and such.
3/19 | This is from our most recent group meeting. You can now search for cards and add them to a list that displays temp and weather. Lists are not able to be saved just yet!
3/19 cont. | Added some styling to the cards. Made cards lists overflow downward. Added time to location to the cards as well. By default the destination is set to Boulder, CO. We will make this adjustable in the future, must discuss how we would like to implement this.
4/1 | TODO: I added a dropdown menu for logged in users. This menu needs to get populated by user lists and contain a link for creating a new list.
4/18 | A lot has changed. Created a routes directory and moved routes.js there. I also moved all of the route behaviors into their own js files, so routes.js only calls functions from their own js file. I made this change to isolate behaviors and make code easier to adjust and understand. I also added the ability for users to store their own lists. Lists should be loaded into the db, and will be selectable from a dropdown list. The frontend and backend for this feature was also finished. I also removed the file structure tree because it is now obsolute and will continue to change.

## Getting up and running:
1. Clone this repo
2. Get the '.env' file from me. This includes all our API keys. Nothing works without it.
3. In your terminal type 'npm install'
4. To run the server type 'npm start'

## Asides:
* The express server can found in server.js, it has a lot of comments explaining what everything does.
* EJS is just a templating engine, I think it might be a pretty simple thing to use, so look it up, but this can be easily swapped for something else right now!
* nodemon is running, so if the server is running and you make any changes to server.js it will automatically restart.
* Stop the server with 'ctrl + C' if in linux
* Text me if you have questions.
* Please run 'npm install' everytime you pull just incase extra dependencies were installed since the last time you pulled.
* 'killall node' might help if you cannot connect to localhost but the server is running
  
- **models**
  - This directory holds the file *user.js*. This is what is called a schema, it is essentially a pre-made db structure. We can reference this file when making calls to the db so we can make sure we send data in the correct structure, and know what structure to expect when we request data. 
- **node_modules**
  - This is where all of our dependencies are installed. You should never have to open this.
- **resources**
  - This is where our static resources live. Static resources include client-side js, images, and css. If we reference things that live here we never need to include resources. For example, to link *login.js* we call *js/login.js*, NOT *resources/js/login.js*.
- **views**
  - **pages**
    - This includes our *index.ejs* file. This ejs file changes based on data from the backend. What is displayed to the user is actually a mix of partials loaded into this file. Check the ejs *include* commands.
  - **partials**
    - *add-card* Contains the search bar and add button form. Triggers POST-getPlace.
    - *bootstrap* Contains the links for bootstrap
    - *cardDeck* HTML for the card deck AND cards, subject to HEAVY change
    - *login-modal* HTML for the login modal
    - *nav* HTML for the nav bar
    - *registerForm* Page for when a user wants to register, this also links to *register.js*.
    - *temp* This is never loaded as of now, contains buttons for testing API calls
- **routes**
  - *routes.js* This file contains all of our routes. Each route calls a function that defines the routes behavior. These functions exist in other files (in the routes directory). Each file has the same name as the route, e.g the behavior for the '/login' get route can be found in the login.js file.  
- **.env**
  - This is a secret file containing our API keys! Each key is stored in a variable name. These can be referenced in our backend, example: *process.env.MONGOURL*.
- **.gitignore**
  - Tells git to ignore certain files. You can override this, but please don't ever do that.
- **app.yaml**
  - Currently not in use, but we can use this to host our project on Google Cloud.
- **package-lock.json**
  - Honestly, just ignore this. It is dynamically generated from npm.
- **package.json**
  - This file tells node what dependencies we have loaded. When you run 'npm install' it looks for this file and installs listed dependencies. We also define other app behavior there, like what file to run when we type 'npm start' and if we want to run any other scripts, such as nodemon, when we start up.
- **README.md**
  - This is the file you're currently reading!
- **server.js**
  - This file contains our sever setup. It sets our view engine (ejs), connects to our database, loads our static resources, sets up sessioning, links some dependencies. This file will rarely need to be changed or looked at.
