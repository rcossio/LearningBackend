const requireRole = ({ allowedRoles, redirectOnFailure = '/not-authorized' }) => {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.redirect(redirectOnFailure);
    }
    next();
  };
};

const redirectUnauthorizedOrAdmin = (req, res, next) => { //Similar to requireUserOrPremium but with different redirection behavior
  if (!req.auth) {
    return res.redirect('/auth/login');
  } else if (req.auth.role === 'admin') {
    return res.redirect('/not-authorized');
  }
  next();
};


const requireAuthenticated = requireRole({ allowedRoles: ['user', 'premium', 'admin'] }); 
const redirectUnauthenticated = requireRole({ allowedRoles: ['user', 'premium', 'admin'], redirectOnFailure: '/auth/login' }); // Similar to `requireAuthenticated` but redirects to login
const requireUserOrPremium = requireRole({ allowedRoles: ['user', 'premium'] });
const requirePremiumOrAdmin = requireRole({ allowedRoles: ['premium', 'admin'] });
const requireAdmin = requireRole({ allowedRoles: ['admin'] });

export { redirectUnauthorizedOrAdmin, redirectUnauthenticated, requireAuthenticated, requireUserOrPremium, requireAdmin, requirePremiumOrAdmin };
