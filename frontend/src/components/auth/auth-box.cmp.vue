<template>
  <article class="auth-box">
    <login v-if="authState === 'login'" />
    <signup v-if="authState === 'signup'" />
  </article>
</template>

<script>
import login from './login.cmp'
import signup from './signup.cmp'
export default {
  data() {
    return {
      authState: 'login',
    }
  },
  components: {
    login,
    signup,
  },
  created() {
    if (this.$store.getters.loggedInUser) {
      this.authState = 'free pass'
    }
  },
}
</script>

<style></style>
