import { httpService } from './http.service'

//for testing porpuses:
// import { postService } from './post.service'

export const authService = {
  login,
  logout,
  signup,
}

async function login(username, password) {
  try {
    const loggedInUser = await httpService.post('auth/login', {
      username,
      password,
    })
    console.log('loggedInUser:', loggedInUser)
    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    return loggedInUser
  } catch (err) {
    console.log('error while fetching login: ', err)
    throw err
  }
}
async function logout() {
  try {
    return await httpService.post('auth/logout')
  } catch (err) {
    console.log('error while fetching logout: ', err)
    throw err
  }
}

async function signup(details) {
  try {
    return await httpService.post('auth/signup', details)
  } catch (err) {
    console.log('error while fetching signup: ', err)
    throw err
  }
}
