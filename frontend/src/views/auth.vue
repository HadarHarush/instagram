<template>
  <section class="auth">
    <h1>auth</h1>
    <auth-box />
  </section>
</template>

<script>
import authBox from '../components/auth/auth-box.cmp'
export default {
  components: {
    authBox,
  },
  created() {
    console.log('home page created')
    if (this.$store.getters.loggedInUser) {
      this.$router.push('/feed')
    }
  },
}
</script>

<style></style>
