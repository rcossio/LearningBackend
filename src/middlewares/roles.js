const checkRole = ({roles, redirect}) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
        return res.redirect( redirect || '/not-authorized');
    }
    next();
}}

const requireUserLogin = (req,res,next) => {
  if (!req.auth) {
      return res.redirect('/auth/login');
  } else if (req.auth.role === 'admin') {
      return res.redirect('/not-authorized');
  } else {
      next();
  }
}

const requireLogin = checkRole( {roles:['user','premium','admin'], redirect: '/auth/login'})
const checkIsUser = checkRole( {roles:['user','premium']})
const checkIsPremiumOrAdmin = checkRole( {roles:['premium','admin']})
const checkIsAdmin = checkRole( {roles:['admin']})
const checkIsLogged = checkRole( {roles:['user', 'premium', 'admin']})

export {checkRole, requireUserLogin, requireLogin, checkIsUser, checkIsAdmin, checkIsLogged, checkIsPremiumOrAdmin }