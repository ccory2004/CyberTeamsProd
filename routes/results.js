const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc    Gets static results page
// @returns Renders /results
// @perms   user
// @route   GET /results
router.get('/', ensureAuth, async (req, res) => {
  try {
    res.render('results')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router