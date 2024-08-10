const db = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const asyncHandler = require('express-async-handler');

const validatorUser = [
  body('firstname').trim()
    .isAlpha().withMessage('First name must contain only letters')
    .isLength({ min: 1, max: 100 }).withMessage('First name must be between 1 and 100 characters'),

  body('lastname').trim()
    .isAlpha().withMessage('Last name must contain only letters')
    .isLength({ min: 1, max: 100 }).withMessage('Last name must be between 1 and 100 characters'),

  body('email').trim()
    .isEmail().withMessage('Invalid email format')
    .isLength({ min: 1, max: 100 }).withMessage('Email must be between 1 and 100 characters'),

  body('password').trim()
    .isLength({ min: 1, max: 100 }).withMessage('Password must be between 1 and 100 characters'),
];

exports.postNewUserInDB = [
  ...validatorUser, 
  asyncHandler(async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).render('signup', {
      title: 'Create user',
      errors: errors.array()
    });
  }
  const {firstname, lastname, email, password} = req.body;
  try {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.createNewUserPost(firstname, lastname, email, hashedPassword);
  const user = await db.getUserByEmail(email);

  req.login(user, (err) => {
  if (err) { return next(err); };
  res.redirect('/');
})
} catch(error) {
  next(error);
}
})
];

exports.getNewUserPage = asyncHandler(async(req, res) => {
  res.render('signup');
}); 

exports.getViewUserRender = asyncHandler(async(req, res) => {
res.render('login');
});

exports.routeLogoutUser = asyncHandler(async(req, res, next) => {
  req.logout((error) => {
    if(error) {return next(error)};
    res.redirect('/');
  });
});

exports.deletUserFromDb = asyncHandler(async(req, res) => {
  const id = req.params.id;
    await db.deleteUser(id);
});

exports.updateUser =[
  ...validatorUser, 
  asyncHandler( async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).render('updateUser',{
      title: 'Update user',
      errors: errors.array()
    });
  }
  const {firstname, lastname, email, id} = req.body;
    await db.updateUserFromDb(firstname, lastname, email, id);
    res.redirect('/');
}
)];

exports.getUserToUpdate =asyncHandler(async(req, res) => {
  const id = req.params.id;
   const user = await db.getUserById(id);
    res.render('updateUser', {user});
});

