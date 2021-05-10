<template>
  <article class="signup-box">
    <form @submit.prevent="signup">
      <input
        type="text"
        placeholder="username"
        v-model="signupDetails.username"
      />
      <input
        type="text"
        placeholder="password"
        v-model="signupDetails.password"
      />
      <input
        type="text"
        placeholder="fullname"
        v-model="signupDetails.fullname"
      />
      <input type="text" placeholder="mail" v-model="signupDetails.mail" />
      <button>signup</button>
    </form>
  </article>
</template>

<script>
export default {
  data() {
    return {
      signupDetails: {
        username: '',
        password: '',
        fullname: '',
        password: '',
      },
    }
  },
  methods: {
    async signup() {
      try {
        const deepDetails = JSON.parse(JSON.stringify(this.signupDetails))
        const loggedInUser = await this.$store.dispatch({
          type: 'signup',
          details: {
            username: deepDetails.username,
            password: deepDetails.password,
            fullname: deepDetails.fullname,
            mail: deepDetails.mail,
          },
        })

        this.$router.push('/feed')
      } catch (err) {
        console.log('error in signup from login cmp: ', err)
        throw err
      }
    },
  },
  created() {
    console.log('signup min page created')
  },
}
</script>

<style></style>
