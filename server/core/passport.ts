import passport from "passport";

import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as VKStrategy } from "passport-vkontakte";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

import { createJWT } from "../utils/createJWT";

import dotenv from "dotenv";
import { UserData } from "../../client/pages";
const { User } = require("../models");

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: "accounts.examplesoft.com",
  audience: "yoursite.net",
};

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
  new VKStrategy(
    {
      clientID: process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
      clientSecret: process.env.VKONTAKTE_APP_SECRET,
      callbackURL: "http://localhost:3001/auth/vkontake/callback",
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        let userData: UserData;
        const obj: Omit<UserData, "id"> = {
          fullname: profile.displayName,
          avatarUrl: profile._json.photo_200,
          isActive: 0,
          username: profile.username,
          phone: "",
        };

        obj.token = createJWT(obj);

        const findUser = await User.findOne({
          where: {
            username: obj.username,
          },
        });

        console.log(userData);

        if (!userData) {
          const user = await User.create(obj);
          userData = user.toJSON();
        } else {
          userData = await findUser.toJSON();
        }

        done(null, { ...userData, token: createJWT(userData) });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };
