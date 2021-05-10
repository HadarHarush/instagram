<template>
  <a class="view-all-comments" @click="loadPostModal"
    >View all {{ commentsQuantity }} comments</a
  >
</template>

<script>
export default {
  props: ['commentsQuantity', 'postId'],
  methods: {
    loadPostModal() {
        this.$store.commit({ type: 'updatePostModalId', postId: this.postId })
    },
  },
}
</script>

<style></style>
