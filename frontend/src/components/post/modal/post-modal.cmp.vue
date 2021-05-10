<template>
  <article v-if="myPost" class="post-modal modal flex" @click.stop>
    <post-img class="modal-view" :img="myPost.imgUrl" />
    <div class="big-box fg-1">
      <post-header class="big-box-item content-box" :post="myPost" />
      <div class="text-box big-box-item fg-1 flex column">
        <description class="content-box" :post="myPost" />
        <comments :comments="myPost.comments" />
      </div>
      <div
        class="post-reactions-container second-content-box big-box-item flex column"
      >
        <post-fast-reactions-bar :post="myPost" />
        <post-hot-like class="big-bottom-text-space" :post="myPost" />
        <p class="time">{{ myPost.createdAt | moment('from', 'now', true) }}</p>
      </div>
      <add-comment class="big-box-item content-box" :postId="myPost._id" />
    </div>
  </article>
</template>

<script>
import postHeader from '../post-view/post-header.cmp'
import postImg from '../post-view/post-img.cmp'
import postFastReactionsBar from '../post-view/post-fast-reactions-bar.cmp'
import postHotLike from '../post-view/post-hot-likes.cmp'
import userText from '../post-view/user-text.cmp'
import viewCommentButton from '../post-view/view-comment-button.cmp'
import hotComments from '../post-view/hot-comments.cmp'
import comments from '../post-view/comments.cmp'
import comment from '../post-view/comment.cmp'
import description from '../post-view/post-modal-desc.cmp'
import addComment from '../post-view/add-comment.cmp'
import profileImg from '../general-mini-cmps/profile-img.cmp'
export default {
  computed: {
    myPost() {
      const postId = this.$store.getters.postModalId
      const { feedPosts } = this.$store.getters
      const post = feedPosts.find((currPost) => currPost._id === postId)
      return post
      // return this.$store.getters.currPostModal
    },
    descriptionComment() {
      return {
        profileImgUrl: this.myPost.by.profileImgUrl,
        username: this.myPost.by.username,
        txt: this.myPost.txt,
        createdAt: this.myPost.createdAt,
      }
    },
  },
  components: {
    postHeader,
    postImg,
    postFastReactionsBar,
    postHotLike,
    userText,
    viewCommentButton,
    hotComments,
    comments,
    comment,
    addComment,
    profileImg,
    description,
  },
}
</script>

<style></style>
