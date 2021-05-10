<template>
  <section v-if="loggedInUser" class="home flex justify-center">
    <div class="feed-container flex column">
      <!-- <div class="stories-feed-container insta-card center-childs">
        <h2>stories feed</h2>
      </div> -->
      <posts-feed />
    </div>
    <!-- <div class="suggestions-container center-childs insta-card">
      <h2>suggestions</h2>
    </div> -->
  </section>
</template>

<script>
import postsFeed from '../components/posts-feed.cmp'

export default {
  components: {
    postsFeed,
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
  created() {
    if (!this.$store.getters.loggedInUser) {
      this.$router.push('/')
    }
  },
}
</script>

<style></style>
