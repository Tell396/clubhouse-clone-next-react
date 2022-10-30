import passport from "passport";

import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as GoogleStrategy } from "passport-google"

import dotenv from "dotenv";
const { User } = require("../models");

dotenv.config();

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        const obj = {
          fullname: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: 0,
          username: profile.username,
          phone: "",
        };

        const findUser = await User.findOne({
          where: {
            username: obj.username,
          },
        });

        if (!findUser) {
          const user = await User.create(obj);
          return done(null, user.toJSON());
        }

        done(null, findUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
		"google",
		new GoogleStrategy({
    returnURL: 'http://localhost:3001/auth/google/return',
    realm: 'http://localhost:3001/'
  },
  function(identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {

				console.log(done)
				return done(err, user);
    });
  }
));

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  })
});

console.log(passport)

export { passport };
