import express from 'express';
import passport from 'passport';

const app = express();

app.post('/auth/twitter', passport.authenticate('twitter'), function (req, res) {
  res.redirect('/users/' + req.user.username);
});
app.listen(3001, (err) => {
  console.log('Все ок, кайфарик');
});
