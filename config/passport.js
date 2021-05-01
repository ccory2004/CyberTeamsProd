const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const Allow = require('../models/Allow')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        var newUser = {
          googleId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          enabled: false,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })
          let allowlist = await Allow.findOne({listName: "allowlist"}).lean()
          if (user) {
            done(null, user)
          } else {
            for(email in allowlist.emailList) {
              if(allowlist.emailList[email] === newUser.email){
                newUser.enabled = true;
              }
            }
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
