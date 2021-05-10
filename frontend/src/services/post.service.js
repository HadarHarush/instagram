import { httpService } from './http.service'

export const postService = {
  getFeedPosts,
  getPostById,
  addPost,
  removePost,
  //tiny operations:
  addLike,
  removeLike,
  addComment,
}

async function getFeedPosts(pagingType, pagingInfo) {
  try {
    const queryParams = {
      pagingType,
      pagingInfo,
    }
    return await httpService.get('post/feed', queryParams)
  } catch (err) {
    console.log('coldnt get post: ', err)
    throw err
  }
}
async function getPostById(postId, viewType) {
  try {
    const queryData = {
      viewType,
    }
    return await httpService.get(`post/${postId}`, queryData)
  } catch (err) {
    console.log('coldnt get post: ', err)
    throw err
  }
}
async function addPost(postDetails) {
  try {
    return await httpService.post('post', postDetails)
  } catch (err) {
    console.log('coldnt add post: ', err)
    throw err
  }
}
async function removePost(postId) {
  try {
    return await httpService.delete(`post/${postId}`)
  } catch (err) {
    console.log('coldnt remove post: ', err)
    throw err
  }
}

//tiny operations:

async function addLike(postId) {
  return await httpService.post('post/like', { postId })
}

async function removeLike(postId) {
  return await httpService.delete('post/like', { postId })
}

async function addComment(postId, comment) {
  return await httpService.post('post/comment', { postId, comment })
}
