const checkIsLogged = (req, res, next) => {
    if (!req.auth) {
        return res.redirect('/auth/login');
    }
    next();
}

export {checkIsLogged}