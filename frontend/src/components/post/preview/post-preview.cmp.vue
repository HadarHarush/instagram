<template>
  <article class="post-preview big-box insta-card">
    <post-header class="big-box-item" :post="myPost" />
    <post-img class="preview-view" :img="myPost.imgUrl" />
    <div
      class="post-reactions-container big-box-item second-content-box-conatiner flex column"
    >
      <post-fast-reactions-bar class="second-content-box" :post="myPost" />
      <post-hot-like class="second-content-box" :post="myPost" />
      <div class="second-content-box">
        <user-text
          class="big-bottom-text-space"
          :username="myPost.by.username"
          :txt="myPost.txt"
        />
        <div class="comments-box flex column big-bottom-text-space">
          <view-comment-button
            class="big-bottom-text-space"
            :commentsQuantity="myPost.comments.length"
            :postId="myPost._id"
            :post="myPost"
          />
          <hot-comments :post="post" />
        </div>
        <p class="time big-bottom-text-space">
          {{ myPost.createdAt | moment('from', 'now', true) }}
        </p>
      </div>
    </div>
    <add-comment class="big-box-item content-box" :postId="myPost._id" />
  </article>
</template>

<script>
import postHeader from '../header.cmp'
import postImg from '../img.cmp'
import postFastReactionsBar from '../fast-reactions.cmp'
import postHotLike from '../hot-like.cmp'
import userText from '../../general-mini-cmps/user-text.cmp'
import viewCommentButton from '../view-comment-button.cmp'
import hotComments from '../hot-comments.cmp'
import addComment from '../add-comment.cmp'
export default {
  props: ['postId', 'post'],
  data() {
    return {
      myPost: null,
    }
  },
  created() {
    if (this.post) {
      this.myPost = this.post
    } else {
      this.$store.dispatch({ type: 'getPostById', postId: this.postId })
    }
  },
  components: {
    postHeader,
    postImg,
    postFastReactionsBar,
    postHotLike,
    userText,
    viewCommentButton,
    hotComments,
    addComment,
  },
}
</script>

<style></style>
