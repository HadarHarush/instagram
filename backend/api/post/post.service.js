const dbService = require('../../services/db.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const utilService = require('../../services/util.service')
const { emit, emitToRoom } = require('../../services/socket.service')
const ObjectId = require('mongodb').ObjectId
const { json } = require('express')

const POST_KEY = 'post'
const EMPTY_POST = {
  txt: null,
  imgUrl: [],
  createdAt: null,
  by: null,
  comments: [],
  likedBy: [],
  loc: null,
}

module.exports = {
  addPost,
  removePost,
  getViewPost,
  getFeedPosts,
  addLike,
  removeLike,
  addComment,
}

async function getViewPost(postId) {
  try {
    //starter:
    const binaryPost = await _getBinaryPost(postId)

    //by
    binaryPost.by = await userService.getMinimalViewUser(binaryPost.by)

    //comments:
    const prmCommentsByView = binaryPost.comments.map((currComment) =>
      userService.getMinimalViewUser(currComment.by)
    )
    const commentsByView = await Promise.all(prmCommentsByView)
    binaryPost.comments = binaryPost.comments.map((currComment, idx) => {
      const viewComment = JSON.parse(JSON.stringify(currComment))
      viewComment.by = commentsByView[idx]
      return viewComment
    })

    //liked by:
    const prmLikedByView = binaryPost.likedBy.map((currLikedById) =>
      userService.getMinimalViewUser(currLikedById)
    )
    const likedByView = await Promise.all(prmLikedByView)
    binaryPost.likedBy = likedByView

    return binaryPost
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function addPost({ imgUrl, txt, loc, by }) {
  try {
    const tmpPost = JSON.parse(JSON.stringify(EMPTY_POST))
    tmpPost.imgUrl = imgUrl
    tmpPost.txt = txt
    tmpPost.createdAt = Date.now()
    tmpPost.by = by
    if (loc) tmpPost.loc = loc
    const collection = await dbService.getCollection(POST_KEY)
    const res = await collection.insertOne(tmpPost)
    const post = res.ops[0]
    const postId = post._id

    //update post in user too
    const userCollection = await dbService.getCollection('user')
    await userCollection.updateOne(
      { _id: ObjectId(by) },
      { $push: { postsIds: JSON.parse(JSON.stringify(postId)) } }
    )

    return await getViewPost(postId)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function removePost(postId) {
  try {
    const collection = await dbService.getCollection(POST_KEY)
    const post = await collection.findOne({ _id: ObjectId(postId) })
    const userCollection = await dbService.getCollection('user')
    const userId = post.by
    const pullingProccess = await userCollection.updateOne(
      { _id: ObjectId(post.by) },
      { $pull: { postsIds: JSON.parse(JSON.stringify(postId)) } }
    )
    await collection.deleteOne({ _id: ObjectId(postId) })
  } catch (err) {
    console.log('error while trying to remove post: ', err)
    throw err
  }
}

async function getFeedPosts(userId, pagingType, pagingInfo) {
  try {
    const user = await userService.getUserById(userId)
    let feedUsers = []
    if (user.following.length) {
      const prmFeedUsers = user.following.map((currUserId) =>
        userService.getUserById(currUserId)
      )
      feedUsers = await Promise.all(prmFeedUsers)
    }
    feedUsers.push(user)

    const unFlattenfeedPostsIds = feedUsers.map((currUser) => currUser.postsIds)
    const feedPostsIds = _flatten(unFlattenfeedPostsIds)
    if (!feedPostsIds.length) return []
    const prmFullFeedPosts = feedPostsIds.map((currPostId) =>
      _getBinaryPost(currPostId)
    )
    const fullFeedPosts = await Promise.all(prmFullFeedPosts)
    const pagedPosts = _getPagedPosts(fullFeedPosts, pagingType, pagingInfo)

    //return view posts:
    const prmViewPosts = pagedPosts.map((currBinaryPost) =>
      getViewPost(currBinaryPost._id)
    )
    const viewPosts = await Promise.all(prmViewPosts)

    return viewPosts
  } catch (err) {
    console.log('couldnt get feed posts: ', err)
    throw err
  }
}

//tiny operation functions:

async function addLike(postId, byId) {
  const collection = await dbService.getCollection(POST_KEY)
  await collection.updateOne(
    { _id: ObjectId(postId) },
    { $push: { likedBy: byId } }
  )
  const viewLike = await userService.getMinimalViewUser(byId)
  emitToRoom(
    'postExternalManipulation',
    { type: 'like', viewLike, postId },
    postId
  )
  const post = await collection.findOne({ _id: ObjectId(postId) })
  const activity = await userService.addActivity(
    post.by,
    byId,
    'postManipulation',
    {
      manipulationType: 'like',
      postId,
    }
  )

  return viewLike
}

async function removeLike(postId, byId) {
  const collection = await dbService.getCollection(POST_KEY)
  await collection.updateOne(
    { _id: ObjectId(postId) },
    { $pull: { likedBy: JSON.parse(JSON.stringify(byId)) } }
  )
  emitToRoom(
    'postExternalManipulation',
    { type: 'unlike', byId, postId },
    postId
  )

  const post = await collection.findOne({ _id: ObjectId(postId) })
  await userService.removeActivity(post.by, byId, 'postManipulation', {
    manipulationType: 'like',
    postId,
  })
  return 'unliked'
}

async function addComment(postId, byId, comment) {
  comment.createdAt = Date.now()
  comment.id = utilService.makeId()
  comment.likedBy = []
  comment.by = byId
  const collection = await dbService.getCollection(POST_KEY)
  await collection.updateOne(
    { _id: ObjectId(postId) },
    { $push: { comments: comment } }
  )
  const viewComment = comment
  viewComment.by = await userService.getMinimalViewUser(byId)
  emitToRoom(
    'postExternalManipulation',
    { type: 'comment', viewComment, postId },
    postId
  )

  const post = await collection.findOne({ _id: ObjectId(postId) })
  const activity = await userService.addActivity(
    post.by,
    byId,
    'postManipulation',
    {
      manipulationType: 'comment',
      postId,
      commentId: comment.id,
    }
  )

  return viewComment
}

async function _getBinaryPost(postId) {
  try {
    const collection = await dbService.getCollection(POST_KEY)
    return await collection.findOne({ _id: ObjectId(postId) })
  } catch (err) {
    console.log('couldnt get post: ', err)
    throw err
  }
}

function _getPagedPosts(posts, pagingType, pagingInfo) {
  const deepPosts = JSON.parse(JSON.stringify(posts))
  const chronoPosts = deepPosts.sort((a, b) => -(a.createdAt - b.createdAt))

  let fromIdx = 0
  let toIdx = chronoPosts.length - 1

  if (pagingType === 'starter') {
    toIdx = 4
  } else {
    const postIdx = chronoPosts.findIndex((currPost) => {
      return currPost._id == pagingInfo
    })
    if (postIdx === -1) throw Error('couldnt find mentioned post')

    if (pagingType === 'more') {
      fromIdx = postIdx + 1
      toIdx = postIdx + 5
    }

    if (pagingType === 'new') {
      if (postIdx === 0) {
        return []
      } else {
        toIdx = postIdx - 1
      }
    }
  }

  let slicedPosts = []
  if (fromIdx >= chronoPosts.length) {
    slicedPosts = []
  } else if (toIdx >= chronoPosts.length) {
    slicedPosts = chronoPosts.slice(fromIdx)
  } else {
    slicedPosts = chronoPosts.slice(fromIdx, toIdx + 1)
    // slicedPosts = chronoPosts.slice()
  }
  return slicedPosts
}

function _flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten
    )
  }, [])
}
