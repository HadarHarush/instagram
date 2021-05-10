<template>
  <div class="shadow-screen" @click="closeAddPost">
    <add-post />
  </div>
</template>

<script>
import addPost from './add-post.cmp'
export default {
  methods: {
    closeAddPost() {
      this.$store.commit('closeAddPost')
    },
  },
  components: {
    addPost,
  },
}
</script>

<style></style>
