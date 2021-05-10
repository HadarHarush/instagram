import Vue from 'vue'
import Vuex from 'vuex'
import postStore from './post.store'
import userStore from './user.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    postModalId: null,
    isAddPostOpen: false,
    isActivitiesOpen: false,
  },
  mutations: {
    updatePostModalId(state, { postId }) {
      state.postModalId = postId
    },
    closePostModal(state) {
      state.postModalId = null
    },
    updateScreenWidth(state) {
      console.log('updating screen width')
      state.screenWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )
    },
    openAddPost(state) {
      state.isAddPostOpen = true
    },
    closeAddPost(state) {
      state.isAddPostOpen = false
    },
    openCommentsModal(state, { postId }) {
      state.currCommentsModalPostId = postId
    },
    closeCommentsModal(state) {
      state.currCommentsModalPostId = null
    },
  },
  actions: {},
  getters: {
    postModalId(state) {
      return state.postModalId
    },
    isAddPostOpen(state) {
      return state.isAddPostOpen
    },
    isActivitiesOpen(state) {
      return state.isActivitiesOpen
    },
  },
  modules: {
    postStore,
    userStore,
  },
})
