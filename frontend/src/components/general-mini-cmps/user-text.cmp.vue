<template>
  <p class="user-text">
    <a class="username">{{ username }}</a> {{ txt }}
  </p>
</template>

<script>
export default {
  props: ['username', 'userId', 'txt'],
}
</script>

<style></style>
