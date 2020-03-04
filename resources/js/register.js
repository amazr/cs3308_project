/**
 * This function creates invalid and warning messages for the registration form!
 * @param {String} message -This is passed by ejs, which gets it from the server. This is a message that correlates to a user error
 * 
 */

function register_error(message) {
    if (message === "invuser" || message === "usernameempty") {
        document.getElementById("username-field").classList.add('is-invalid');
        let invText = document.createElement('p');
        invText.classList.add("text-danger");
        invText.classList.add("mb-0");
        invText.classList.add("mt-2");
        invText.innerHTML = (message === "invuser" ? "Username already taken!" : "Please enter a username!");
        document.getElementById("username-group").appendChild(invText);
    }
    else if (message === "passwordmatch" || message === "passwordempty") {
        document.getElementById("password-field").classList.add('is-invalid');
        document.getElementById("r_password-field").classList.add('is-invalid');
        let invText = document.createElement('p');
        invText.classList.add("text-danger");
        invText.classList.add("mb-0");
        invText.classList.add("mt-2");
        invText.innerHTML = (message === "passwordmatch" ? "Passwords do not match!" : "Please enter a password!");
        document.getElementById("password-group").appendChild(invText);
    }
}