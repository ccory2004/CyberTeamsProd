const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAcct } = require('../middleware/auth')
const Team = require('../models/Team')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Gets dashboard WITH sensitive info for the user
// @returns Renders /dashboard
// @perms   user
// @route   GET /dashboard
router.get('/dashboard', ensureAcct, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.user.cpId }).lean()
    if(req.user.enabled) {
      if(team == null) {
        res.render('dashboard', {
          name: req.user.firstName,
        })
      } else {
        res.render('dashboard', {
          name: req.user.firstName,
          team,
        })
      }
    } else {
      var disabledString = "This account is currently disabled, please check back when an admin has enabled your account."
      res.render('dashboard', {
        name: req.user.firstName,
        disabledString,
      })
    }  
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
