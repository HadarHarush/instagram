import { postService } from '../services/post.service'
import { uploadImgFromDataUri } from '../services/upload-image.service'
import { socketService } from '../services/socket.service'
export default {
  state: {
    feedPosts: [],
  },
  mutations: {
    loadStarterPostsToFeed(state, { newPosts }) {
      state.feedPosts = newPosts
    },
    loadMorePostsToFeed(state, { newPosts }) {
      newPosts.forEach((currPost) => state.feedPosts.push(currPost))
    },
    loadNewPostsToFeed(state, { newPosts }) {
      newPosts.sort((a, b) => a.createdAt - b.createdAt)
      newPosts.forEach((currPost) => state.feedPosts.unshift(currPost))
    },

    //tiny operation:
    addLike(state, { postId, loggedInUser }) {
      const deepLoggedInUser = JSON.parse(JSON.stringify(loggedInUser))
      const viewLike = {
        username: deepLoggedInUser.username,
        profileImgUrl: deepLoggedInUser.profileImgUrl,
        _id: deepLoggedInUser._id,
      }

      //changes on feed posts (optional):
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      if (post && post !== -1) {
        if (
          !post.likedBy.find(
            (currLike) => deepLoggedInUser._id === currLike._id
          )
        ) {
          post.likedBy.push(viewLike)
        }
      }
    },
    addExternalLike(state, { postId, viewLike }) {
      //changes on feed posts (optional):
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      if (post && post !== -1) {
        if (!post.likedBy.find((currLike) => currLike._id === viewLike._id)) {
          post.likedBy.push(viewLike)
        }
      }
    },
    removeLike(state, { postId, loggedInUserId }) {
      //changes on feed posts (optional):
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      const likeIdx = post.likedBy.findIndex(
        (currLike) => currLike._id === loggedInUserId
      )
      if (post && post !== -1 && likeIdx > -1) post.likedBy.splice(likeIdx, 1)
    },
    removeExternalLike(state, { postId, byId }) {
      //changes on feed posts (optional):
      console.log('byId:', byId)
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      console.log('post:', post)
      const likeIdx = post.likedBy.findIndex(
        (currLike) => currLike._id === byId
      )
      console.log('likeIdx:', likeIdx)
      if (post && post !== -1 && likeIdx > -1) post.likedBy.splice(likeIdx, 1)
    },
    addComment(state, { postId, comment }) {
      //changes on feed posts (optional):
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      if (post && post !== -1) {
        console.log('post:', post)
        const duplicateComment = !post.comments.find((currComment) => {
          console.log('currComment:', currComment)
          console.log('comment:', comment)
          currComment._id === comment._id
        })
        console.log('duplicateComment:', duplicateComment)
        if (
          !post.comments.find((currComment) => currComment.id === comment.id)
        ) {
          post.comments.push(comment)
        }
      }
    },
    addExternalComment(state, { postId, viewComment }) {
      //changes on feed posts (optional):
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      if (post && post !== -1) {
        if (
          !post.comments.find(
            (currComment) => currComment.id === viewComment.id
          )
        ) {
          post.comments.push(viewComment)
        }
      }
    },
    editComment(state, { postId, comment }) {
      const post = state.feedPosts.find((currPost) => currPost._id === postId)
      const commentIdx = post.comments.findIndex(
        (currComment) => currComment._id === comment._id
      )
      post.comments.splice(commentIdx, 1)
      post.comments.push(comment)
    },
    restorePostStates(state) {
      state.feedPosts = []
    },
  },
  actions: {
    async loadStarterPostsToFeed(context, payload) {
      const newPosts = await postService.getFeedPosts('starter')
      context.commit({ type: 'loadStarterPostsToFeed', newPosts })
      //join this posts channels for recieving live updates about them:
      newPosts.forEach((currPost) => socketService.join(currPost._id))
      return newPosts
    },
    async loadMorePostsToFeed(context, payload) {
      const lastPostId =
        context.getters.feedPosts[context.getters.feedPosts.length - 1]._id
      const newPosts = await postService.getFeedPosts('more', lastPostId)
      context.commit({ type: 'loadMorePostsToFeed', newPosts })
      //join this posts channels for recieving live updates about them:
      newPosts.forEach((currPost) => socketService.join(currPost._id))
      return newPosts
    },
    async loadNewPostsToFeed(context, payload) {
      const firstPostId = context.getters.feedPosts[0]._id
      const newPosts = await postService.getFeedPosts('new', firstPostId)
      context.commit({ type: 'loadNewPostsToFeed', newPosts })
      //join this posts channels for recieving live updates about them:
      newPosts.forEach((currPost) => socketService.join(currPost._id))
      return newPosts
    },

    async addPost(context, { postDetails }) {
      try {
        const imgObj = await uploadImgFromDataUri(postDetails.imgUri)
        const imgUrl = imgObj.url
        delete postDetails.imgUri
        postDetails.imgUrl = imgUrl
        const updatedPost = await postService.addPost(postDetails)
        await context.dispatch('loadNewPostsToFeed')
        return updatedPost
      } catch (err) {
        console.log('couldnt add post: ', err)
      }
    },

    //tiny operations:
    async addLike(context, { postId }) {
      try {
        context.commit({
          type: 'addLike',
          postId,
          loggedInUser: context.getters.loggedInUser,
        })
        const like = await postService.addLike(postId)
      } catch (err) {
        console.log('cant like: ', err)
        context.commit({
          type: 'removeLike',
          postId,
          loggedInUserId: context.getters.loggedInUser._id,
        })
        throw err
      }
    },
    async removeLike(context, { postId }) {
      try {
        context.commit({
          type: 'removeLike',
          postId,
          loggedInUserId: context.getters.loggedInUser._id,
        })
        const unlike = await postService.removeLike(postId)
      } catch (err) {
        console.log('cant like: ', err)
        context.commit({
          type: 'addLike',
          postId,
          loggedInUserId: context.getters.loggedInUser._id,
        })
        throw err
      }
    },
    async addComment(context, { postId, comment }) {
      try {
        const updatedComment = await postService.addComment(postId, comment)
        context.commit({
          type: 'addComment',
          postId,
          comment: updatedComment,
        })
        return updatedComment
      } catch (err) {
        console.log('cant comment: ', err)
        throw err
      }
    },

    //upadte post external manipulations in posts stream live:
    postExternalManipulation(context, { data }) {
      const { postId } = data

      if (data.type === 'like') {
        context.commit({
          type: 'addExternalLike',
          postId,
          viewLike: data.viewLike,
        })
      } else if (data.type === 'unlike') {
        console.log('unlike order recieved')
        context.commit({
          type: 'removeExternalLike',
          postId,
          byId: data.byId,
        })
      } else if (data.type === 'comment') {
        context.commit({
          type: 'addExternalComment',
          postId,
          viewComment: data.viewComment,
        })
      }
    },
  },
  getters: {
    feedPosts(state, payload) {
      return state.feedPosts
    },
    currPostModal(state) {
      return state.currPostModal
    },
  },
}
