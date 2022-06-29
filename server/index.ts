import dotenv from 'dotenv';
import express from 'express';
import { passport } from './core/passport';

import './core/db';

dotenv.config({
  path: 'server/.env',
});


const app = express();

app.use(passport.initialize());

app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.send(
      `<script>window.close(); window.opener.postMessage(${JSON.stringify(req.user)}), '*'); window.close();</script>`,
    );
  },
);

app.get('/test', (req,res) => {
  res.send({message: 'Hello!'})
})

app.listen(3001, () => {
  console.log('All is ok. server is stable');
});
