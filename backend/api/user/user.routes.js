const express = require('express')
const userController = require('./user.controller')

const router = express.Router()

router.route('/activity').get(userController.getViewActivities)
router
  .route('/:userId')
  .get(userController.getUserById)
  .put(userController.updateUser)
router.route('/').post(userController.addUser)

module.exports = router
