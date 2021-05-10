<template>
  <div class="hot-comments flex column">
    <div
      class="comment-preview flex space-between"
      v-for="hotComment in hotComments"
      :key="hotComment.id"
    >
      <user-text :username="hotComment.by.username" :txt="hotComment.txt" />
    </div>
  </div>
</template>

<script>
import userText from '../general-mini-cmps/user-text.cmp'
export default {
  props: ['post'],
  components: { userText },
  computed: {
    hotComments() {
      const deepComments = JSON.parse(JSON.stringify(this.post.comments))
      const followedUsers = this.$store.getters.loggedInUser.following
      const loggedInUserId = this.$store.getters.loggedInUser._id

      deepComments.forEach((currComment) => (currComment.rating = 0))
      deepComments.forEach((currComment) => {
        if (currComment._id === loggedInUserId) {
          rating += 1000
        }
        if (followedUsers.includes(currComment._id)) {
          rating += 10
        }
      })
      const hotComments = deepComments.sort((a, b) => -(a - b))
      return hotComments.slice(0, 2)
    },
  },
}
</script>

<style></style>
