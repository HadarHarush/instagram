<template>
  <div class="comment flex space-between">
    <div class="left flex column">
      <div class="flex little-bottom-text-space">
        <profile-img :profileImgUrl="post.by.profileImgUrl" alt="P" />
        <user-text :username="post.by.username" :txt="post.txt" />
      </div>
      <div class="flex">
        <p>{{ post.createdAt | moment('from', 'now', true) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import profileImg from '../general-mini-cmps/profile-img.cmp'
import userText from '../../general-mini-cmps/user-text.cmp'
export default {
  props: ['post'],
  components: {
    profileImg,
    userText,
  },
}
</script>

<style></style>
