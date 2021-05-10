<template>
  <div class="post-header content-box flex space-between">
    <div class="details flex align-center">
      <profile-img :profileImgUrl="post.by.profileImgUrl" />
      <div class="flex column text">
        <a class="username">{{ post.by.username }}</a>
        <p v-if="post.loc">{{ post.loc.name }}</p>
      </div>
    </div>
    <button>
      <svg
        aria-label="More options"
        class="_8-yf5 "
        fill="#262626"
        height="16"
        viewBox="0 0 48 48"
        width="16"
      >
        <circle
          clip-rule="evenodd"
          cx="8"
          cy="24"
          fill-rule="evenodd"
          r="4.5"
        ></circle>
        <circle
          clip-rule="evenodd"
          cx="24"
          cy="24"
          fill-rule="evenodd"
          r="4.5"
        ></circle>
        <circle
          clip-rule="evenodd"
          cx="40"
          cy="24"
          fill-rule="evenodd"
          r="4.5"
        ></circle>
      </svg>
    </button>
  </div>
</template>

<script>
import profileImg from '../general-mini-cmps/profile-img.cmp'
export default {
  props: ['post'],
  components: {
    profileImg,
  },
}
</script>

<style></style>
