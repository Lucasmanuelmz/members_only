const expressAsyncHandler = require('express-async-handler');
const db = require('../models/postsModel');
const {body, validationResult} = require('express-validator');

const validationPost = [
  body('title').trim()
  .isLength({ min: 1, max: 300 }).withMessage('Title must be between 1 and 300 characters long'),

  body('message').trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters long'),

  body('userId').trim()
    .optional()
];

exports.createPostDb =[
  ...validationPost, 
  expressAsyncHandler(async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log(errors.array())
   return res.status(400).render('errors', {
      title: 'Errors',
      errors: errors.array()
    });
  }
  const {title, message, userId} = req.body;
  await db.createPost(title, message, userId);
  res.redirect('/')
})];

exports.getPostDb = expressAsyncHandler(async(req, res) => {
  const id = req.params.id
  const post = await db.getPostById(id);
  res.render('post', {post})
});

exports.createMessage = expressAsyncHandler(async(req, res) => {
  res.render('message')
});

exports.updatePostDb = [
  ...validationPost, 
  expressAsyncHandler(
   async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).render('errors', {
      title: 'Errors',
      errors: errors.array()
    })
  }
  const {title, message, id} = req.body;
  await db.updatePost(title, message, id);
  res.redirect('/')
})]

exports.deletePostDb = expressAsyncHandler(async(req, res) => {
  const id = req.body.id;
  await db.deletePost(id);
  res.redirect('/')
})