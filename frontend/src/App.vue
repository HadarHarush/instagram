<template>
  <div id="app">
    <app-header v-if="$store.getters.loggedInUser" />
    <add-post-shadow v-if="$store.getters.isAddPostOpen" />
    <post-shadow-screen v-if="$store.getters.postModalId" />
    <main class="main-container page-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import './assets/css/main.css'
import { socketService } from './services/socket.service'
import postShadowScreen from './components/post/modal/post-shadow-screen.cmp'
import appHeader from './components/header/header.cmp'
import addPostShadow from './components/modals/add-post-shadow-screen.cmp'

export default {
  computed: {
    loggedInUser() {
      console.log('logeed in user: ', this.$store.getters.loggedInUser)
      return this.$store.getters.loggedInUser
    },
  },
  components: {
    postShadowScreen,
    appHeader,
    addPostShadow,
  },
  watch: {
    loggedInUser: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          if (oldVal) socketService.terminate()
          socketService.setup()

          //real time post manipulation updating:
          socketService.join(this.loggedInUser._id)
          socketService.on('postExternalManipulation', (data) => {
            this.$store.dispatch({ type: 'postExternalManipulation', data })
          })

          //real time activities updating:
          this.$store.dispatch('loadActivities')
          socketService.on('addExternalActivity', (data) =>
            this.$store.commit({ type: 'addExternalActivity', activity: data })
          )
          socketService.on('removeExternalActivity', (data) =>
            this.$store.commit({
              type: 'removeExternalActivity',
              activity: data,
            })
          )
        } else {
          if (oldVal) socketService.terminate()
        }
      },
    },
  },
}
</script>
