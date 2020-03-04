function register_error(message) {
    if (message === "invuser") {
        document.getElementById("username-field").classList.add('is-invalid');
        let invText = document.createElement('p');
        invText.classList.add("text-danger");
        invText.classList.add("mb-0");
        invText.classList.add("mt-2");
        invText.innerHTML="Username already taken!";
        document.getElementById("username-group").appendChild(invText);
    }
    else if (message === "passwordmatch") {
        document.getElementById("password-field").classList.add('is-invalid');
        document.getElementById("r_password-field").classList.add('is-invalid');
        let invText = document.createElement('p');
        invText.classList.add("text-danger");
        invText.classList.add("mb-0");
        invText.classList.add("mt-2");
        invText.innerHTML="Passwords do not match!";
        document.getElementById("password-group").appendChild(invText);
    }
}