const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')
const Allow = require('../models/Allow')

// @desc    Modifies User to enable account
// @returns Redirects to /admin
// @perms   admin
// @route   PUT /allow/old
router.put('/old', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    let user = await User.findOne({
        _id: req.body.id
      })
      .lean()
    user.enabled = true
    user = await User.findOneAndUpdate({
      _id: req.body.id
    }, user, {
      new: true,
      runValidators: true,
    })
    res.redirect("/admin")
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Adds email to Allowlist
// @returns Redirects to /admin
// @perms   admin
// @route   PUT /allow/new
router.put('/new', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    let allowlist = await Allow.findOne({
        listName: "allowlist"
      })
      .lean()
    allowlist.emailList.push(req.body.email)
    allowlist = await Allow.findOneAndUpdate({
      listName: "allowlist"
    }, allowlist, {
      new: true,
      runValidators: true,
    })
    res.redirect("/admin")
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Gets Allowlist
// @returns Allow object
// @perms   user
// @route   GET /allow
router.get('/', ensureAuth, async (req, res) => {
  try {
    let allowlist = await Allow.findOne("allowlist")
      .lean()

    if (!allowlist) {
      return res.render('error/404')
    }
    res.send(allowlist)
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


// @desc    Modifies user to disable account
// @returns Redirects to /admin
// @perms   admin
// @route   PUT /allow/disable
router.put('/disable', ensureAuth, async (req, res) => {
  console.log("Disabling Users")
  if (!req.user.admin) {
    res.render('error/500')
  }
  console.log("Req ID: "+req.body.id)
  try {
    let user = await User.findOne({
        _id: req.body.id
      })
      .lean()
    user.enabled = false
    user = await User.findOneAndUpdate({
      _id: req.body.id
    }, user, {
      new: true,
      runValidators: true,
    })
    res.redirect("/admin")
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router