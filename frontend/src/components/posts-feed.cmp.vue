<template>
  <section v-if="$store.getters.feedPosts" class="posts-feed flex column">
    <button @click="loadNewPosts">check for new posts</button>
    <post-preview v-for="post in posts" :key="post._id" :post="post" />
    <button @click="loadMorePosts">More</button>
  </section>
</template>

<script>
import postPreview from './post/preview/post-preview.cmp'

export default {
  computed: {
    posts() {
      return this.$store.getters.feedPosts
    },
  },
  methods: {
    loadMorePosts() {
      this.$store.dispatch('loadMorePostsToFeed')
    },
    loadNewPosts() {
      this.$store.dispatch('loadNewPostsToFeed')
    },
  },
  components: {
    postPreview,
  },
  created() {
    this.$store.dispatch('loadStarterPostsToFeed')
  },
}
</script>

<style></style>
