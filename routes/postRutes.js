const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController')

postRouter.post('/messages', postController.createPostDb);
postRouter.post('/update/message', postController.updatePostDb);
postRouter.get('/message', postController.getPostDb);
postRouter.post('/message/delete', postController.deletePostDb);
postRouter.get('/create/new/message', postController.createMessage);

module.exports = postRouter;