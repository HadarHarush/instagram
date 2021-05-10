import { storageService } from '../../async-storage.service'

const USER_KEY = 'user'

export const userService = {
  getUserById,
  getUsersByIds,
  isUsernameExist,
  getUserByUsername,
  addUser,
  updateUser,
}

async function getUsersByIds(ids) {
  try {
    const prm = ids.map(async (currId) => await getUserById(currId))
    return await Promise.all(prm)
  } catch (err) {
    console.log('couldnt get users: ', err)
    throw err
  }
}

async function isUsernameExist(username) {
  try {
    const users = await storageService.query(USER_KEY)
    console.log('users:', users)
    console.log('username:', username)
    const user = users.find((currUser) => currUser.username === username)
    console.log('user:', user)
    if (!user || user === -1) return false
    return true
  } catch (err) {
    console.log('error in checking username existance proccess: ', err)
    throw err
  }
}

async function getUserByUsername(username) {
  try {
    const users = await storageService.query(USER_KEY)
    const user = users.find((currUser) => currUser.username === username)
    if (!user || user === -1) throw Error('couldnt find this user')
    return user
  } catch (err) {
    console.log('error in checking username existance proccess: ', err)
    throw err
  }
}

async function getUserById(userId) {
  try {
    return await storageService.get(USER_KEY, userId)
  } catch (err) {
    console.log('couldnt get user: ', err)
    throw err
  }
}

async function addUser({ username, password, fullname, mail }) {
  try {
    const user = {
      username,
      password,
      fullname,
      mail,
      profileImgUrl: 'https://noImg',
      createdAt: Date.now(),
      following: [],
      followers: [],
      savedPostsIds: [],
      activities: [],
      postsIds: [],
    }
    return await storageService.post(USER_KEY, user)
  } catch (err) {
    console.log('couldnt add user')
    throw err
  }
}

async function updateUser(newUser) {
  return await storageService.put(USER_KEY, newUser)
}
