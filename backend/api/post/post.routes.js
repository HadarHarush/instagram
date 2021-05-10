const express = require('express')
const postController = require('./post.controller')

const router = express.Router()

router.route('/feed').get(postController.getFeedPosts)

router
  .route('/like')
  .post(postController.addLike)
  .delete(postController.removeLike)
router.route('/comment').post(postController.addComment)

router
  .route('/:postId')
  .get(postController.getPost)
  .delete(postController.removePost)

router.route('/').post(postController.addPost)
module.exports = router
