const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.redirect('/not-authorized');
    }
    next();
}}

export {checkRole}