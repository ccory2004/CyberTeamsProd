const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Team = require('../models/Team')

// @desc    Gets teams WITHOUT sensitive info
// @returns Renders /teams with Team objects stripped of cpUniqueCode
// @perms   user
// @route   GET /teams
router.get('/', ensureAuth, async (req, res) => {
  try {
    var teams = await Team.find()
      .populate('user')
      .lean()
    //strips the cpUniqueCode
    for(var team in teams) {
      console.log(team)
      teams[team].cpUniqueCode = null
    }
    console.log(teams);
    res.render('teams', {
      teams,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Process new Team
// @returns Redirect /teams
// @perms   admin
// @route   POST /teams
router.post('/', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    console.log(req.body)
    await Team.create(req.body)
    res.redirect('/teams')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Modifies Team
// @returns Redirect /admin
// @perms   admin
// @route   PUT /teams/:id
router.put('/:id', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    let team = await Team.findById(req.params.id).lean()

    if (!team) {
      return res.render('error/404')
    }
    team = await Team.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
    res.redirect("/admin")
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Gets Team WITH sensitive info
// @returns Team object
// @perms   admin
// @route   GET /teams/:id
router.get('/:id', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    let team = await Team.findById(req.params.id).populate('user').lean()

    if (!team) {
      return res.render('error/404')
    }
    res.send(team)
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Deletes Team
// @returns Redirect /admin
// @perms   admin
// @route   DELETE /teams/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    let team = await Team.findById(req.params.id).lean()  
    if (!team) {
      return res.render('error/404')
    }
    await Team.deleteOne({ _id: req.params.id })
    res.redirect('/admin')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router