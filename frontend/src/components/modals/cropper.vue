<template>
  <div class="cropper flex">
    <div class="cropper-conatiner fg-1">
      <img
        class="cropper-img"
        ref="imageToCrop"
        :src="imgSrc"
        height="100%"
        max-width="500px"
      />
    </div>
    <button @click="crop" class="crop-button button-with-bgc">crop</button>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
export default {
  props: ['imgSrc'],
  data() {
    return {
      cropper: null,
    }
  },
  methods: {
    crop() {
      if (!this.cropper) return null
      const canvas = this.cropper.getCroppedCanvas()
      const croppedImg = canvas.toDataURL('image/png')
      this.$emit('gotCroppedImg', croppedImg)
    },
  },
  mounted() {
    this.cropper = new Cropper(this.$refs.imageToCrop, {
      aspectRatio: 1,
    })
  },
}
</script>

<style></style>
