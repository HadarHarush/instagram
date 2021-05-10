<template>
  <p v-if="!activities">You dont have activities...</p>
  <div v-else class="activities-box flex column">
    <div v-for="activity in activities" :key="activity.id">
      <post-manipulation-activity
        v-if="activity.type === 'postManipulation'"
        :activity="activity"
      />
    </div>
  </div>
</template>

<script>
import postManipulationActivity from '../activities/postManipulation.cmp'
export default {
  computed: {
    activities() {
      return this.$store.getters.activities
    },
  },
  components: {
    postManipulationActivity,
  },
}
</script>

<style scoped>
.activities-box {
  width: 483px;
}
</style>
