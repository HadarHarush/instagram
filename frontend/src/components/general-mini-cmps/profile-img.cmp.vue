<template>
  <a class="profile-img avoid-hover-effect">
    <img :src="profileImgUrl" alt="profile" />
  </a>
</template>

<script>
export default {
  props: ['profileImgUrl'],
}
</script>

<style></style>
