<template>
  <div class="shadow-screen" @click="closePostModal">
    <post-modal />
  </div>
</template>

<script>
import postModal from './post-modal.cmp'
export default {
  methods: {
    closePostModal() {
      this.$store.commit('closePostModal')
    },
  },
  components: {
    postModal,
  },
}
</script>

<style></style>
