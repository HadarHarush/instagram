<template>
  <article class="add-post modal flex" @click.stop>
    <img
      class="post-img"
      v-if="post.imgUri && !isCropperOpen"
      :src="post.imgUri"
    />
    <label
      class="post-img-placeholder center-childs pointer"
      v-if="!post.imgUri && !isCropperOpen"
      for="uploadImgAddPost"
    >
      <img src="@/assets/img/icons/insert-picture.svg" alt="C" />
    </label>
    <cropper
      v-if="isCropperOpen"
      :imgSrc="srcToCropper"
      @gotCroppedImg="changePicture"
    />
    <div class="big-box fg-1">
      <postHeader class="big-box-item" :post="demoPostData" />
      <form
        id="addPostForm"
        hidden
        @submit.prevent="addPost"
        class="add-post-form"
      ></form>
      <div class="big-box-item inputs-box fg-1 flex column">
        <div class="content-box flex">
          <input
            class="classic-input fg-1"
            type="text"
            placeholder="caption"
            v-model="post.txt"
          />
        </div>
        <div class="content-box flex">
          <input
            class="classic-input fg-1"
            type="text"
            placeholder="location"
            v-model="post.loc.name"
          />
        </div>
      </div>
      <div class="buttons-box big-box-item content-box flex justify-center">
        <input
          id="uploadImgAddPost"
          hidden
          ref="imgInput"
          @input="passImgToCropper"
          type="file"
        />
        <label for="uploadImgAddPost" class="pointer">
          <img src="@/assets/img/icons/camera.svg" alt="C" width="24" />
        </label>
        <button
          class="primary-publish"
          :class="activnessClass"
          @click="addPost"
        >
          Add
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import cropper from './cropper'
import postHeader from '../post/header.cmp'
export default {
  data() {
    return {
      isCropperOpen: false,
      srcToImg: null,
      srcToCropper: null,
      post: {
        txt: '',
        loc: {
          name: '',
        },
        imgUri: null,
      },
    }
  },
  methods: {
    changePicture(imgUrl) {
      this.isCropperOpen = false
      this.post.imgUri = imgUrl
    },
    passImgToCropper(ev) {
      const input = this.$refs.imgInput
      if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.srcToCropper = e.target.result
          this.isCropperOpen = true
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    addPost() {
      if (!this.post.txt || !this.post.imgUri) {
        return
      }
      const deepPost = JSON.parse(JSON.stringify(this.post))
      this.$store.dispatch({ type: 'addPost', postDetails: deepPost })
      this.$store.commit('closeAddPost')
    },
  },
  computed: {
    demoPostData() {
      const loggedInUser = this.$store.getters.loggedInUser
      return {
        by: {
          username: loggedInUser.username,
          profileImgUrl: loggedInUser.profileImgUrl,
        },
        loc: this.post.loc,
      }
    },
    activnessClass() {
      return {
        'not-active': !this.post.txt || !this.post.imgUri,
      }
    },
  },
  components: {
    cropper,
    postHeader,
  },
}
</script>

<style></style>
