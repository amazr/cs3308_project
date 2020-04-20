function form_submit(form) 
{
    document.getElementById(form).submit();
}

function login_error(message)
{
    if (message === "invusername")
    {
        //This should set form angriness for invalid username
    }
    else if (message === "invpassword")
    {
        //This should set form angriness for invalid passwords
    }
}