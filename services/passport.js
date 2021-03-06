const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('@models/User')
const keys = require('@configs/keys')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user)
    })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existUser) => {
        if (existUser) {
          done(null, existUser)
        } else {
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user))
        }
      })
    }
  )
)
