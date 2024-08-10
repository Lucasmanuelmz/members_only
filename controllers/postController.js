const expressAsyncHandler = require('express-async-handler');
const db = require('../models/postsModel');
const {body, validationResult} = require('express-validator');

const validationPost = [
  body('title').trim()
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Title must contain only alphabetic characters and spaces')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters long'),

  body('message').trim()
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Message must contain only alphabetic and numeric characters')
    .isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters long'),

  body('memberId').trim()
    .isNumeric().withMessage('Member ID must be a numeric value')
];

exports.createPostDb =[
  ...validationPost, 
  expressAsyncHandler(async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
   return res.status(400).render('posts', {
      title: 'Errors',
      errors: errors.array()
    });
  }
  const {message, userId} = req.body;
  await db.createPost(message, userId);
  res.redirect('/')
})];

exports.getPostDb = expressAsyncHandler(async(req, res) => {
  const id = req.params.id
  const post = await db.getPostById(id);
  res.render('post', {post})
});

exports.updatePostDb =[
  ...validationPost, 
  expressAsyncHandler(
   async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).render('posts', {
      title: 'Errors',
      errors: errors.array()
    })
  }
  const {message, id} = req.body;
  await db.updatePost(message, id);
  res.redirect('/')
})]

exports.deletePostDb = expressAsyncHandler(async(req, res) => {
  const id = req.body.id;
  await db.deletePost(id);
  res.redirect('/')
})