const userService = require('./user.service')

async function getUserById(req, res) {
  try {
    const { userId } = req.params
    const user = await userService.getUserById(userId)
    res.json(user)
  } catch (err) {
    res.status(500).send({ err: 'user didnt found' })
  }
}

async function addUser(req, res) {
  try {
    const userToAdd = req.body
    const user = await userService.addUser(userToAdd)
    res.json(user)
  } catch (err) {
    res.status(500).send({ err: 'cannot add user' })
  }
}

async function updateUser(req, res) {
  try {
    const newUser = req.body
    const updatedUser = await userService.updateUser(newUser)
    res.json(updatedUser)
  } catch (err) {
    res.status(500).send({ err: 'cannot update user' })
  }
}

async function getViewActivities(req, res) {
  try {
    const loggedInUserId = req.session.loggedInUser._id
    const viewActivities = await userService.getViewActivities(loggedInUserId)
    res.json(viewActivities)
  } catch (err) {
    res.status(500).send({ err: 'cannot get activities' })
  }
}

module.exports = {
  getUserById,
  addUser,
  updateUser,
  getViewActivities,
}
