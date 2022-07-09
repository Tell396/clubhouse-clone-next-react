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

// Conenct to databse
import './core/db';

dotenv.config({
  path: 'server/.env',
});

const app = express();
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
  secret: 'asd asd asda sda sdas d',
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
  sharp.cache(false);
});

app.post('/auth/phone', (req, res) => {
  const phone = req.body.phone
  const user_id = req.user.id


  // ((max, min) => Math.floor(Math.random() * (max - min + 1) + min))(1000,9999)
  if (phone) {
    const code = Code.create({
      
    })
  }
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
