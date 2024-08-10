const db = require('../db/db')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({usernameField: 'email'}, 
  async(email, password, done) => {
   
    try {
    const {rows} = await db.query('SELECT * FROM users WHERE email = $1',[email]);
    const user = rows[0];
    if(!user) {return done(null, false, {message: 'incorrect email'})}
     const match = await bcrypt.compare(password, user.password);
    if(!match) {
     return done(null, false, {message: 'Icorrect password'})
    }
    return done(null, user)
  }catch(error) {
    return done(error)
  }
})
);

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
  try {
    const {rows} = await db.query('SELECT * FROM users WHERE id = $1',[id]);
    const user = rows[0];
    done(null, user)
  }catch(error) {
    done(error)
  }
});

module.exports = passport;