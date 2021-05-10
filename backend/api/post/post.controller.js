const { json } = require('express')
const postService = require('./post.service')

module.exports = {
  addPost,
  removePost,
  getPost,
  getFeedPosts,
  addLike,
  removeLike,
  addComment,
}

async function addPost(req, res) {
  try {
    const { imgUrl, txt, loc } = req.body
    let by = req.session.loggedInUser?._id
    //postman:
    // if (!by) {
    //   by = '605863198918b62f68650dd6'
    // }
    const updatedPost = await postService.addPost({ imgUrl, txt, loc, by })
    res.json(updatedPost)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'cannot add post' })
  }
}

async function removePost(req, res) {
  try {
    const postId = req.params.postId
    await postService.removePost(postId)
    res.send('deleted')
  } catch (err) {
    res.status(500).send({ err: 'cannot add post' })
  }
}

async function getPost(req, res) {
  try {
    const { postId } = req.params
    const post = await postService.getViewPost(postId)
    res.json(post)
  } catch (err) {
    res.status(500).send({ err: 'cannot get post' })
  }
}

async function getFeedPosts(req, res) {
  try {
    const { pagingType } = req.query
    const { pagingInfo } = req.query
    const loggedInUserId = req.session.loggedInUser._id
    // let loggedInUserId = '605863198918b62f68650dd6'
    const feedPosts = await postService.getFeedPosts(
      loggedInUserId,
      pagingType,
      pagingInfo
    )
    res.json(feedPosts)
  } catch (err) {
    res.status(500).send({ err: 'cannot get feed posts' })
  }
}

//tiny operations:

async function addLike(req, res) {
  try {
    const loggedInUserId = req.session.loggedInUser._id
    const { postId } = req.body
    const updatedLike = await postService.addLike(postId, loggedInUserId)
    res.json(updatedLike)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'cannot like this post' })
  }
}

async function removeLike(req, res) {
  try {
    const loggedInUserId = req.session.loggedInUser._id
    const { postId } = req.body
    return await postService.removeLike(postId, loggedInUserId)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'cannot unlike this post' })
  }
}

async function addComment(req, res) {
  try {
    const loggedInUserId = req.session.loggedInUser._id
    const { postId } = req.body
    const { comment } = req.body
    const updatedComment = await postService.addComment(
      postId,
      loggedInUserId,
      comment
    )
    res.json(updatedComment)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'cannot add comment to this post' })
  }
}
