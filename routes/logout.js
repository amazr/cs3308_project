function logoutGet(req, res)
{
    //If a user is logged in, delete the sessioning information
    if(req.session.user) 
    {
        delete req.session.user;
        delete req.session.cards;
    }

    res.redirect('/');
}

module.exports = {
    logoutGet: function(req, res)
    {
        logoutGet(req, res);
    }
}