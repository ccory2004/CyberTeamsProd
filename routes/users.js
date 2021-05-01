const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')

// @desc    Gets Users WITHOUT sensitive info
// @returns User objects
// @perms   user
// @route   GET /users
router.get('/', ensureAuth, async (req, res) => {
  try {
    const users = await User.find()
      .populate('user')
      .lean()
    for(var user in users) {
      console.log(user)
      users[user].googleId = null
    }
    res.send(users)
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Gets the FULL User object of the user requesting it
// @returns User object
// @perms   user
// @route   GET /users/self
router.get('/self', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('user')
      .lean()
    res.send(user)
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Gets the FULL User object using the user's id
// @returns User object
// @perms   admin
// @route   GET /users/:id
router.put('/:id', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    var user = await User.findById(req.params.id).lean()
    user.cpId = req.body.cpId
    user = await User.findOneAndUpdate({ _id: req.params.id }, user, {
      new: true,
      runValidators: true,
    })
    res.redirect('/admin')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router