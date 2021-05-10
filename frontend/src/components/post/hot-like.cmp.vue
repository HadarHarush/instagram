<template>
  <div class="liked-by flex align-center">
    <profile-img v-if="hotLike" :profileImgUrl="hotLike.profileImgUrl" />
    <p v-if="hotLike">
      Liked by <a class="username">{{ hotLike.username }}</a> and
      <span>{{ likesQuantity - 1 }} others</span>
    </p>
    <p v-if="!hotLike">{{ likesQuantity }} likes</p>
  </div>
</template>

<script>
import profileImg from '../general-mini-cmps/profile-img.cmp'
export default {
  props: ['post'],
  components: {
    profileImg,
  },
  computed: {
    hotLike() {
      const likes = this.post.likedBy
      const followedUsers = this.$store.getters.loggedInUser.following
      const hotLike = likes.find((currLike) =>
        followedUsers.includes(currLike._id)
      )
      if (hotLike) return hotLike
      return null
    },
    likesQuantity() {
      return this.post.likedBy.length
    },
  },
}
</script>

<style></style>
