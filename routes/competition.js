const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Team = require('../models/Team')
const Round = require('../models/Round')

// @desc    Shows all rounds WITHOUT sensitive information
// @returns Renders /competition with public Round object
// @perms   user
// @route   GET /competition/all
router.get('/all', ensureAuth, async (req, res) => {
  try {
    var rounds = await Round.find().lean()
    //strips the links and private rounds
    for(var round in rounds) {
      if(rounds[round].status === "private") {
        rounds.splice(round, 1)
      }
      rounds[round].imageNames = null
      rounds[round].imageLinks = null
      rounds[round].imageChecksums = null
    }
    res.render('competition', {
      rounds,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show rounds by division of the user requesting it
// @returns Renders /competition with public Round object
// @perms   user
// @route   GET /competition
router.get('/', ensureAuth, async (req, res) => {
  try {
    var rounds = await Round.find().lean()
    //strips the links and private rounds
    for(round = rounds.length-1; round >= 0;  round--) {
      try {
        var team = await Team.findById(req.user.cpId).lean()
        var division = team.division
      } catch {
        res.render('competition', {
          rounds,
          noTeamString: "You are not on a team",
        })
        break;
      }
      if(rounds[round].status === "private") {
        rounds.splice(round, 1)
      } else if (!(rounds[round].division === division)) {
        rounds.splice(round, 1)
      } else if(Date.parse(rounds[round].dateRemove) < Date.now()){
        rounds.splice(round, 1)
      }else {
        rounds[round].imageNames = null
        rounds[round].imageLinks = null
        rounds[round].imageChecksums = null
      }
    }
    res.render('competition', {
      rounds,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Process new Round creation
// @returns Redirect /admin
// @perms   admin
// @route   POST /competition
router.post('/', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    newImageNames = []
    newImageLinks = []
    newImageChecksums = []
    if(req.body.windowsTenLink != "" && req.body.windowsTenChecksum != ""){
      newImageNames.push("Windows 10 Image")
      newImageLinks.push(req.body.windowsTenLink)
      newImageChecksums.push(req.body.windowsTenChecksum)
    }
    if(req.body.windowsServerLink != "" && req.body.windowsServerChecksum != ""){
      newImageNames.push("Windows Server Image")
      newImageLinks.push(req.body.windowsServerLink)
      newImageChecksums.push(req.body.windowsServerChecksum)
    }
    if(req.body.ubuntuLink != "" && req.body.ubuntuChecksum != ""){
      newImageNames.push("Ubuntu Image")
      newImageLinks.push(req.body.ubuntuLink)
      newImageChecksums.push(req.body.ubuntuChecksum)
    }
    if(req.body.debianLink != "" && req.body.debianChecksum != ""){
      newImageNames.push("Debian Image")
      newImageLinks.push(req.body.debianLink)
      newImageChecksums.push(req.body.debianChecksum)
    }
    var newRound = new Round({
      title: req.body.title,
      datePublish: req.body.datePublish,
      dateRemove: req.body.dateRemove,
      status: req.body.status,
      division: req.body.division,
      createdAt: req.body.createdAt,
      imageNames: newImageNames,
      imageLinks: newImageLinks,
      imageChecksums: newImageChecksums
    })
    await Round.create(newRound)
    res.redirect('/admin')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Gets Round WITH sensitive info based on id
// @returns Round object
// @perms   admin
// @route   GET /competition/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let round = await Round.findById(req.params.id).lean()
    if (!round) {
      res.render('error/404')
    }
    var team = await Team.findById(req.user.cpId).lean()
    var division = team.division
    if((round.status === "private" || round.division != division) && !req.user.admin) {
      round.imageNames = null
      round.imageLinks = null
      round.imageChecksums = null
    } else if((round.datePublish > Date.now() || round.dateRemove < Date.now()) && !req.user.admin){
      round.imageNames = null
      round.imageLinks = null
      round.imageChecksums = null
    }
    res.send(round)
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})
// @desc    Deletes round with specified id
// @returns Redirects /admin
// @perms   admin
// @route   DELETE /competition/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  if (!req.user.admin) {
    res.render('error/500')
  }
  try {
    await Round.deleteOne({ _id: req.params.id })
    res.redirect('/admin')
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

module.exports = router