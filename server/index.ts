// Main for server logic
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';

// For feedback with client
import cors from 'cors'

// For image input
import multer from 'multer'
import * as crypto from 'crypto'
import sharp from 'sharp'

// For interaction with file system
import fs from 'fs'

// Authentication
import { passport } from './core/passport';
import { Code } from './models'
import { UserData } from '../client/pages/index'

import Axios from '../client/core/axios'

declare global {
  namespace Express {
    interface User extends UserData { }
  }
}

// Conenct to databse
import './core/db';

dotenv.config({
  path: 'server/.env',
});

const app = express();
// Here we generate phone code with 4 symbols
const generatePhoneCode = (max: number = 9999, min: number = 9999) => Math.floor(Math.random() * (max - min + 1) + min)
// Upload photography with this settings
const uploader = multer({
  storage: multer.diskStorage({
    destination: function(_req, _file, cb) {
      cb(null, '../client/public/avatars')
    },

    filename: function(req, file, cb) {
      const ext = file.originalname.split('.').pop()
      const hash = crypto
        .createHash('md5')
        .update(file.fieldname + Date.now())
        .digest('hex')

      cb(null, `${hash}.${ext}`)
    }
  })
})

app.use(cors())
app.use(passport.initialize());
app.use(express.json())
app.use(session({
  secret: 'some very secret key',
  resave: true,
  saveUninitialized: true
}));

app.post('/upload', uploader.single('photo'), (req, res) => {
  const filePath = req.file.path
  sharp(filePath)
    .resize(150, 150)
    .toFormat('jpg')

    // BUG: Error: Cannot use same file for input and output
    .toFile(filePath.replace('.png', '.jpg'), (err) => {
      if (err) {
        throw err
      } else {
        fs.unlinkSync(filePath)
        res.json({
          url: `/avatars/${req.file.filename.replace('.png', '.jpg')}`
        })
      }
    })
  // Clean cache. DO NOT delete this line!
  sharp.cache(false);
});

app.post('/auth/phone', async (req, res) => {
  const phone = req.body.phone
  const userId = req.user.id

  if (!phone) {
    return res.status(400).send()
  }

  const data = await Axios.get('https://sms.ru/sms/send?api_id=E8537D70-E35D-EF89-5D83-56154CD972A3&to=79662932696&msg=hello+world&json=1')

  await const code = Code.create({
    code: generatePhoneCode(),
    user_id: userId
  })
})

// Make register with github (Passport)
app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(
      `<script>
        window.opener.postMessage('${JSON.stringify(req.user)}', '*');
        window.close();
      </script>`
    );
  },
);

app.listen(3001, () => {
  console.log('All is ok. server is stable');
});
