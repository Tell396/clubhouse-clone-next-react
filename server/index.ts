import express from 'express';
import session from 'express-session';
import './core/db';
import dotenv from 'dotenv';

dotenv.config({
  path: 'server/.env',
});

import { passport } from './core/passport';

const app = express();

app.use(passport.initialize());
app.use(session({ secret: 'melody hensley is my spirit animal' }));

// Make register with github (Passport)
app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.send(
      `<script>
        window.opener.postMessage(${JSON.stringify(req.user)}), '*');
        window.close();
      </script>`
    );

    console.log(req.user)
  },
);

app.get('/test', (req, res) => {
  res.send({ message: 'Hello!' });
});

app.listen(3001, () => {
  console.log('All is ok. server is stable');
});
