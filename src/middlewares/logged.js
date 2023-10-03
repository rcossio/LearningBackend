const checkIsLogged = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
}

export {checkIsLogged}