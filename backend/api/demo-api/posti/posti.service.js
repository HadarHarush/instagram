import { storageService } from '../../async-storage.service'
import { userService } from '../user/user.service'
import { authService } from '../auth/auth.service'

const POST_KEY = 'posti'
const EMPTY_POST = {
  txt: null,
  imgUrl: [],
  createdAt: null,
  by: null,
  comments: [],
  likedBy: [],
  loc: null,
}

export const postiService = {
  getPosts,
  getPost,
  addPost,
}

addPost(
  'https://images.pexels.com/photos/6598911/pexels-photo-6598911.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  'What a great day'
).then(console.log)

async function addPost(imgUrl, txt, loc) {
  try {
    //create post object:
    const tmpPost = JSON.parse(JSON.stringify(EMPTY_POST))
    tmpPost.imgUrl = imgUrl
    tmpPost.txt = txt
    tmpPost.createdAt = Date.now()
    if (loc) tmpPost.loc = loc
    const loggedInUserId = JSON.parse(sessionStorage.getItem('loggedInUser'))
      ._id
    tmpPost.by = loggedInUserId
    console.log('tmpPost:', tmpPost)

    //update DB's:
    const dbPost = await storageService.post(POST_KEY, tmpPost)
    console.log('dbPost:', dbPost)
    const user = await userService.getUserById(loggedInUserId)
    user.postsIds.push(dbPost._id)
    const updatedUser = await userService.updateUser(user)
    authService.updateLoggedInUser(user)
    return dbPost
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getPost(postId, viewType) {
  try {
    const post = await storageService.get(POST_KEY, postId)
    if (viewType === 'preview')
      return await _getViewPostFromPost(post, 'preview')
    if (viewType === 'modal') return await _getViewPostFromPost(post, 'modal')
    return post
  } catch (err) {
    console.log('couldnt get post: ', err)
    throw err
  }
}

async function getPosts(fromIdx, toIdx) {
  try {
    const strLoggedInUser = sessionStorage.getItem('loggedInUser')
    let loggedInUser
    if (strLoggedInUser) {
      loggedInUser = JSON.parse(strLoggedInUser)
    } else {
      throw Error('cannot load feed posts while there is not logged in user')
    }
    // console.log(arguments)
    const user = await userService.getUserById(loggedInUser._id)
    // console.log('user: ', user)
    const usersInFeedIds = _getUsersInFeedIds(user)
    // console.log('usersInFeedIds:', usersInFeedIds)
    if (!user.following?.length) return []
    const users = await userService.getUsersByIds(usersInFeedIds)
    // console.log('users:', users)
    const posts = await _getPostsOfUsers(users)
    // console.log('posts:', posts)
    const chronoPosts = _getChronoPostsByPosts(posts)

    let slicedPosts = []
    if (fromIdx >= chronoPosts.length) {
      slicedPosts = []
    } else if (toIdx >= chronoPosts.length) {
      slicedPosts = chronoPosts.slice(fromidx)
    } else {
      slicedPosts = chronoPosts.slice(fromIdx, toIdx)
    }

    //get posts with details instead of posts with ids only:
    const prmPrettyPosts = slicedPosts.map((currPost) =>
      _getViewPostFromPost(currPost, 'preview')
    )
    return await Promise.all(prmPrettyPosts)
  } catch (err) {
    console.log('couldnt get posts: ', err)
    throw err
  }
}

async function _getPostsOfUsers(users) {
  try {
    const usersPostsMap = users.map((currUser) => currUser.postsIds)
    const postsIds = _flatten(usersPostsMap)
    const prmPosts = postsIds.map(async (currPostId) => {
      return await getPost(currPostId)
    })
    return await Promise.all(prmPosts)
  } catch (err) {
    console.log('couldnt get posts: ', err)
    throw err
  }
}

async function _getViewPostFromPost(post, viewType = 'modal') {
  if (viewType !== 'preview' && viewType !== 'modal')
    throw Error(
      'viewType that passed in params is not recognised in this function'
    )
  const deepPost = JSON.parse(JSON.stringify(post))

  //by minified details:
  const byUser = await userService.getUserById(post.by)
  const by = {
    username: byUser.username,
    profileImgUrl: byUser.profileImgUrl,
    _id: byUser._id,
  }

  //hot like:
  let hotLike = null
  if (byUser.following.length) {
    const hotLikeUser = await userService.getUserById(byUser.following[0])
    hotLike = {
      username: hotLikeUser.username,
      profileImgUrl: hotLikeUser.profileImgUrl,
    }
  }

  //hot comments:
  let hotComments = []
  if (post.comments.length) {
    const commentsSortedByLikes = post.comments.sort(
      (a, b) => a.likedBy.length - b.likedBy.length
    )
    const hotCommentsUsers = []
    const hotCommentUserA = await userService.getUserById(
      commentsSortedByLikes[0].by
    )
    hotCommentsUsers.push(hotCommentUserA)
    if (commentsSortedByLikes.length > 1) {
      const hotCommentUserB = await userService.getUserById(
        commentsSortedByLikes[1].by
      )
      hotCommentsUsers.push(hotCommentUserB)
    }
    hotComments = hotCommentsUsers.map((currUser, idx) => {
      const currComment = commentsSortedByLikes[idx]
      return {
        username: currUser.username,
        txt: currComment.txt,
        isLikedByYou: false,
      }
    })
  }

  deepPost.by = by
  deepPost.hotLike = hotLike
  deepPost.hotComments = hotComments
  if (viewType === 'preview') return deepPost

  //preview addons:
  //is logged user following post owner
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
  const isLoggedInUserFollowing = loggedInUser.following.includes(byUser._id)

  //comments:
  const commentsOwnersIds = post.comments.map((currComment) => currComment.by)
  const prmCommentsOwners = commentsOwnersIds.map((currOwnerId) =>
    userService.getUserById(currOwnerId)
  )
  const commentsOwners = await Promise.all(prmCommentsOwners)

  const commentsModalInformation = commentsOwners.map((currComment, idx) => {
    let isLoggedInUserLike = false
    if (post.comments[idx].likedBy.includes(loggedInUser._id))
      isLoggedInUserLike = true
    return {
      id: post.comments[idx].id,
      username: commentsOwners[idx].username,
      profileImgUrl: commentsOwners[idx].profileImgUrl,
      isLoggedInUserLike,
      byId: post.comments[idx].by,
      likedBy: post.comments[idx].likedBy,
      txt: post.comments[idx].txt,
      createdAt: post.comments[idx].createdAt,
    }
  })

  deepPost.isLoggedInUserFollowing = isLoggedInUserFollowing
  deepPost.comments = commentsModalInformation

  return deepPost
}

async function _getModalPostFromPost(post) {
  //is user following:
  // const postForPreview = _getPrviewPostFromPost(post)
}

function _getChronoPostsByPosts(posts) {
  return posts.sort((a, b) => -(a.createdAt - b.createdAt))
}

function _getUsersInFeedIds(user) {
  const users = user.following
  users.push(user._id)
  return users
}

function _flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten
    )
  }, [])
}
