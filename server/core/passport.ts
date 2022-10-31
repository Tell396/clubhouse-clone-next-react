import passport from "passport";

import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as VKStrategy } from "passport-vkontakte"

import dotenv from "dotenv";
const { User } = require("../models");

dotenv.config();

console.log(process.env.GITHUB_CLIENT_ID)

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

					console.log(profile)

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
    new VKStrategy(
        {
            clientID: process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: process.env.VKONTAKTE_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/vkontakte/callback",
        },
        function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            // Now that we have user's `profile` as seen by VK, we can
            // use it to find corresponding database records on our side.
            // Also we have user's `params` that contains email address (if set in
            // scope), token lifetime, etc.
            // Here, we have a hypothetical `User` class which does what it says.
            User.findOrCreate({ vkontakteId: profile.id })
                .then(function (user) {
                    done(null, user);
                })
                .catch(done);

						console.log(profile)
        }
    )
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  })
});

//console.log(passport)
export { passport };
