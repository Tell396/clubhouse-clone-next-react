import express from 'express';
import session from 'express-session';
import multer from 'multer'
import cors from 'cors'

import './core/db';
import dotenv from 'dotenv';

dotenv.config({
  path: 'server/.env',
});

import { passport } from './core/passport';

const app = express();

app.use(cors())
app.use(passport.initialize());
app.use(session({
  secret: 'asd asd asda sda sdas d',
  resave: true,
  saveUninitialized: true
}));

app.get('/upload', multer({dest: '../public/avatars'}).single('photo'), (req, res) => {
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
