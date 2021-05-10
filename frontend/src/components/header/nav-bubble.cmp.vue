<template>
  <article class="nav-bubble flex column">
    <div class="diamond"></div>
    <nav-bubble-profile-content
      class="nav-bubble-content"
      v-if="content === 'profile'"
    />
    <nav-bubble-activities-content
      class="nav-bubble-content"
      v-if="content === 'activities'"
    />
  </article>
</template>

<script>
import navBubbleProfileContent from './nav-bubble-profile-content.cmp'
import navBubbleActivitiesContent from './nav-vubble-activities.cmp'
export default {
  props: ['content'],
  components: {
    navBubbleProfileContent,
    navBubbleActivitiesContent,
  },
}
</script>

<style>
.nav-bubble-content {
  max-height: 300px;
  max-width: 483px;
  overflow-y: auto;
}
</style>
