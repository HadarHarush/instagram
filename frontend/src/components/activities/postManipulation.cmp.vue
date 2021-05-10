<template>
  <div class="activity flex content-box" @click="loadPostModal">
    <profile-img :profileImgUrl="activity.externalBy.profileImgUrl" />
    <div
      v-if="activity.data.manipulationType === 'like'"
      class="flex space-between fg-1"
    >
      <div class="flex column justify-center">
        <user-text
          :username="activity.externalBy.username"
          :txt="'liked your post'"
        />
        <p>{{ activity.createdAt | moment('from', 'now', true) }}</p>
      </div>
      <a class="post-mini-img-holder">
        <img :src="activity.data.imgUrl" />
      </a>
    </div>
    <div
      v-if="activity.data.manipulationType === 'comment'"
      class="flex space-between fg-1"
    >
      <div class="flex column justify-center">
        <user-text
          :username="activity.externalBy.username"
          :txt="'left a comment in your post: ' + activity.data.txt"
        />
        <p>{{ activity.createdAt | moment('from', 'now', true) }}</p>
      </div>
      <a class="post-mini-img-holder">
        <img :src="activity.data.imgUrl" />
      </a>
    </div>
  </div>
</template>

<script>
import profileImg from '../general-mini-cmps/profile-img.cmp'
import userText from '../general-mini-cmps/user-text.cmp'
export default {
  props: ['activity'],
  methods: {
    loadPostModal() {
      this.$store.commit({
        type: 'updatePostModalId',
        postId: this.activity.data.postId,
      })
    },
  },
  components: {
    profileImg,
    userText,
  },
}
</script>

<style scoped>
.post-mini-img-holder {
  height: 30px;
  width: 30px;
}
.post-mini-img-holder > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
