const checkRole = ({roles, redirect}) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.redirect( redirect || '/not-authorized');
    }
    next();
}}

const requireUserLogin = (req,res,next) => {
  if (!req.user) {
      return res.redirect('/auth/login');
  } else if (req.user.role === 'admin') {
      return res.redirect('/not-authorized');
  } else {
      next();
  }
}

const requireLogin = checkRole( {roles:['user','admin'], redirect: '/auth/login'})
const checkIsUser = checkRole( {roles:['user']})
const checkIsAdmin = checkRole( {roles:['admin']})
const checkIsLogged = checkRole( {roles:['user', 'admin']})

export {checkRole, requireUserLogin, requireLogin, checkIsUser, checkIsAdmin, checkIsLogged }