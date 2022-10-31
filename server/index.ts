// Main for server logic
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

// For feedback with client
import cors from "cors";

// For image input
import multer from "multer";
import * as crypto from "crypto";
import sharp from "sharp";

// For interaction with file system
import fs from "fs";

// Authentication
import { passport } from "./core/passport";
import { Code } from "./models/code";
import { UserData } from "../client/pages/index";

import Axios from "../client/core/axios";

declare global {
  namespace Express {
    interface User extends UserData {}
  }
}

// Conenct to databse
import "./core/db";

dotenv.config({
  path: "server/.env",
});

const app = express();

// Here we generate phone code with 4 symbols
const generatePhoneCode = (max: number = 9999, min: number = 9999) =>
  Math.floor(Math.random() * (max - min + 1) + min);
// Upload photography with this settings
const uploader = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, "../client/public/avatars");
    },

    filename: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      const hash = crypto
        .createHash("md5")
        .update(file.fieldname + Date.now())
        .digest("hex");

      cb(null, `${hash}.${ext}`);
    },
  }),
});

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(
  session({
    secret: "some very secret key",
    resave: true,
    saveUninitialized: true,
  })
);

app.post("/upload", uploader.single("photo"), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)
    .toFormat("jpg")

    // BUG: Error: Cannot use same file for input and output
    .toFile(filePath.replace(".png", ".jpg"), (err) => {
      if (err) {
        throw err;
      } else {
        fs.unlinkSync(filePath);
        res.json({
          url: `/avatars/${req.file.filename.replace(".png", ".jpg")}`,
        });
      }
    });
  // Clean cache. DO NOT delete this line!
  sharp.cache(false);
});

// app.get("/auth/sms", async (req, res) => {
//   const phone = req.query.phone;
//   const userId = req.user.id;
//   const smsCode = generatePhoneCode();

//   if (!phone) {
//     return res.status(400).send();
//   }

//   try {
//     const data = await Axios.get(
//       `https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79662932696&msg=${smsCode}`
//     );

//     const code = Code.create({
//       code: smsCode,
//       user_id: userId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error",
//     });
//   }
// });

app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.send(
      `<script>
        window.opener.postMessage('${JSON.stringify(req.user)}', '*');
        window.close();
      </script>`
    );
  }
);

app.get("/auth/vk", passport.authenticate("vkontakte"));
app.get(
  "/auth/vkontake/callback",
  passport.authenticate("vkontakte", { failureRedirect: "/login" }),
  (req, res) => {
    res.send(
      `<script>
        window.opener.postMessage('${JSON.stringify(req.user)}', '*');
        window.close();
      </script>`
    );
  }
);

app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(3001, () => {
  console.log("All is ok. server is stable");
});
