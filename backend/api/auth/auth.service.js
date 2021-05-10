const dbService = require('../../services/db.service')
const userService = require('../user/user.service')
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')

module.exports = {
  login,
  signup,
}

// signup('meir_harush1', 'meir_harush1', 'meir harush', 'meirharush@gmail.com')
//   .then(console.log)
//   .catch(console.log)

async function login(username, password) {
  const userExistance = await userService.isUsernameExist(username)
  if (!userExistance) return Promise.reject('wrong username or password')
  const user = await userService.getUserByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  return user
}

async function signup(username, password, fullname, mail) {
  const saltRounds = 10
  if (!username || !password || !fullname || !mail) {
    return Promise.reject('fullname, username, password and mail are required!')
  }

  const hash = await bcrypt.hash(password, saltRounds)
  return await userService.addUser({ username, password: hash, fullname, mail })
}
