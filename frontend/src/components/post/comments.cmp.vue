<template>
  <div class="comments">
    <comment
      class="content-box"
      v-for="comment in sortedComments"
      :key="comment.id"
      :comment="comment"
    />
  </div>
</template>

<script>
import comment from './comment.cmp'
export default {
  props: ['comments'],
  components: {
    comment,
  },
  computed: {
    sortedComments() {
      return this.comments.sort((a, b) => -(a.createdAt - b.createdAt))
    },
  },
}
</script>

<style></style>
