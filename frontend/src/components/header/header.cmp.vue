<template>
  <section class="header flex justify-center">
    <div class="header-content main-container flex space-between align-center">
      <a class="logo-container flex align-center">
        <img alt="LOGO" src="@/assets/img/icons/literral-logo.png" />
      </a>
      <search />
      <nav-bar />
    </div>
  </section>
</template>

<script>
import search from './search.cmp'
import navBar from './nav-bar.cmp'
export default {
  data() {
    return {
      isProfileModalOpen: false,
    }
  },
  methods: {
    toggleProfileModal() {
      console.log('toggling profile modal...')
    },
  },
  computed: {},
  components: {
    search,
    navBar,
  },
}
</script>
