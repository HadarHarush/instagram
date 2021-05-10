import { userService } from '../services/user.service'
import { authService } from '../services/auth.service'

export default {
  state: {
    loggedInUser: JSON.parse(sessionStorage.getItem('loggedInUser')),
    activities: null,
  },
  mutations: {
    login(state, { loggedInUser }) {
      state.loggedInUser = loggedInUser
    },
    logout(state) {
      state.loggedInUser = null
    },
    loadActivities(state, { activities }) {
      state.activities = activities
    },
    addExternalActivity(state, { activity }) {
      state.activities.push(activity)
    },
    removeExternalActivity(state, { activity }) {
      const activityIdx = state.activities.findIndex(
        (currAct) => currAct.id === activity.id
      )
      if (activityIdx > -1) state.activities.splice(activityIdx, 1)
    },
    saveUser() {},
    removeUser() {},
  },
  actions: {
    async login(context, { username, password }) {
      try {
        const loggedInUser = await authService.login(username, password)
        context.commit({ type: 'login', loggedInUser })
        return loggedInUser
      } catch (err) {
        console.log('login error in store')
        throw err
      }
    },
    async logout(context) {
      try {
        await authService.logout()
        context.commit('logout')
        context.commit('restorePostStates')
      } catch (err) {
        throw err
      }
    },
    async signup(context, { details }) {
      try {
        console.log('details:', details)
        const loggedInUser = await authService.signup(details)
        context.commit({ type: 'login', loggedInUser })
      } catch (err) {
        throw err
      }
    },
    async loadActivities(context) {
      try {
        const activities = await userService.getViewActivities()
        context.commit({ type: 'loadActivities', activities })
      } catch (err) {
        console.log('couldnt get activities: ', err)
      }
    },
    async removeUser() {},
  },
  getters: {
    loggedInUser(state) {
      return state.loggedInUser
    },
    activities(state) {
      if (!state.activities) return null
      const deepActivities = JSON.parse(JSON.stringify(state.activities))
      deepActivities.sort((a, b) => -(a.createdAt - b.createdAt))
      return deepActivities
    },
  },
}
