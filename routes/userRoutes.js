const express = require('express');
const userRouter = express.Router();
const db = require('../models/usersModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userController = require('../controllers/userController');

passport.use(new LocalStrategy({usernameField: 'email'}, 
  async(email, password, done) => {
   
    try {
    const user = await db.getUserByEmail(email);
    
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
  done(null, user.id);
})

passport.deserializeUser(async(id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user)
  }catch(error) {
    done(error)
  }
});

userRouter.get('/signup', userController.getNewUserPage);
userRouter.post('/signup', userController.postNewUserInDB);
userRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))
userRouter.get('/login', userController.getViewUserRender);
userRouter.get('/logout', userController.routeLogoutUser);
userRouter.post('/user/delete', userController.deletUserFromDb);
userRouter.post('/user/update', userController.updateUser);
userRouter.get('/:id/user/update', userController.getUserToUpdate);

module.exports = userRouter;