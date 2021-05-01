module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (!req.user.enabled) {
        console.log("User not enabled")
        res.redirect('/dashboard')
      } else {
        return next()
      }
    } else {
      res.redirect('/')
    }
  },
  ensureGuest: function (req, res, next) {
    if (!(req.isAuthenticated())) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  },
  ensureAcct: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
  },
}
