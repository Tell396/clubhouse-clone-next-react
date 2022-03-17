import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
// TODO: Add Google auth

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3001/auth/twitter/callback',
    },
    (token, tokenSecret, profile, cb) => {},
  ),
);
