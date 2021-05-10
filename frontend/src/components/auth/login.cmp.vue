<template>
  <article class="login-box">
    <form @submit.prevent="login">
      <select v-model="loginDetails.username">
        <option value="hadar_harush10">hadar_harush10</option>
        <option value="guy_anidjar">guy_anidjar</option>
        <option value="adir_alush12">adir_alush12</option>
        <option value="oryfridenberg">oryfridenberg</option>
        <option value="eyalnoy7">eyalnoy7</option>
      </select>
      <button class="primary-publish">login</button>
    </form>
  </article>
</template>

<script>
export default {
  data() {
    return {
      loginDetails: {
        username: 'nisim_harush1',
      },
    }
  },
  methods: {
    async login() {
      try {
        const deepDetails = JSON.parse(JSON.stringify(this.loginDetails))
        const loggedInUser = await this.$store.dispatch({
          type: 'login',
          username: deepDetails.username,
          password: this.password,
        })

        this.$router.push('/feed')
      } catch (err) {
        console.log('error in login from login cmp: ', err)
        throw err
      }
    },
  },
  computed: {
    password() {
      return this.loginDetails.username
    },
  },
  created() {
    console.log('login min page created')
  },
}
</script>

<style>
.login-box {
  background-color: #ffff;
  max-width: 500px;
  padding: 40px;
}

.login-box > *:not(:last-child),
.login-box form > *:not(:last-child) {
  margin-inline-end: 1rem;
}

.login-box input {
  border: 1px solid grey;
}
</style>
