import express from 'express';
import session from 'express-session';
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv';
import { passport } from './core/passport';
import './core/db';

dotenv.config({
  path: 'server/.env',
});

const app = express();
const uploader = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, '../client/public/avatars')
  },

  filename: function(_req, file, cb) {
   cb(null, file.fieldname + '-' Date.now() + '-' + Math.round(Math.random() * 1e9)
  }
})

app.use(cors())
app.use(passport.initialize());
app.use(session({
  secret: 'asd asd asda sda sdas d',
  resave: true,
  saveUninitialized: true
}));

app.post('/upload', uploader.single('photo'), (req, res) => {
  res.json(req.file)
});

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
