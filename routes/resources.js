const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc    Gets static resources page
// @returns Renders /resources
// @perms   user
// @route   GET /resources
router.get('/', ensureAuth, async (req, res) => {
  try {
    res.render('resources')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router