const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')
const Team = require('../models/Team')
const Round = require('../models/Round')

// @desc    Show round WITH sensitive info based on id
// @returns Renders /admin WITH ALL sensitive User and Team objects
// @perms   admin
// @route   GET /admin
router.get('/', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
      res.render('error/500')
  }
  try {
    const users = await User.find()
      .populate('user')
      .lean()
    const teams = await Team.find()
      .populate('team')
      .lean()
    const rounds = await Round.find()
      .populate('round')
      .lean()
    res.render('admin', {
        users, teams, rounds,
      })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router