const dbService = require('../../services/db.service')
const utilService = require('../../services/util.service')
const { emit, emitToRoom } = require('../../services/socket.service')
const ObjectId = require('mongodb').ObjectId

const USER_KEY = 'user'

module.exports = {
  getUserById,
  getMinimalViewUser,
  getUsersByIds,
  isUsernameExist,
  getUserByUsername,
  addUser,
  updateUser,

  //activities:
  addActivity,
  removeActivity,
  getViewActivities,
}

//done:
async function getUserById(userId) {
  try {
    const collection = await dbService.getCollection(USER_KEY)
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password
    return user
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
    const collection = await dbService.getCollection(USER_KEY)
    const res = await collection.insertOne(user)
    return res.ops[0]
    // return await storageService.post(USER_KEY, user)
  } catch (err) {
    console.log('couldnt add user', err)
    throw err
  }
}
async function updateUser(newUser) {
  try {
    //delete non updatable fields from user:
    delete newUser.createdAt
    const _id = newUser._id
    delete newUser._id

    const collection = await dbService.getCollection(USER_KEY)
    const res = await collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: newUser },
      { returnOriginal: false }
    )
    return res.value
  } catch (err) {
    console.log('couldnt update user: ', err)
    throw err
  }
}
async function getUserByUsername(username) {
  try {
    const collection = await dbService.getCollection(USER_KEY)
    const user = await collection.findOne({ username })
    // const users = await storageService.query(USER_KEY)
    // const user = users.find((currUser) => currUser.username === username)
    // if (!user || user === -1) throw Error('couldnt find this user')
    if (!user) throw Error('couldnt find user')
    return user
  } catch (err) {
    console.log('error in checking username existance proccess: ', err)
    throw err
  }
}
async function getUsersByIds(ids) {
  try {
    const prm = ids.map((currId) => getUserById(currId))
    return await Promise.all(prm)
  } catch (err) {
    console.log('couldnt get users: ', err)
    throw err
  }
}
async function isUsernameExist(username) {
  try {
    const collection = await dbService.getCollection(USER_KEY)
    const user = await collection.findOne({ username })
    if (!user) return false
    return true
  } catch (err) {
    console.log('error in checking username existance proccess: ', err)
    throw err
  }
}

async function getMinimalViewUser(userId) {
  const collection = await dbService.getCollection(USER_KEY)
  const fullUser = await collection.findOne({ _id: ObjectId(userId) })
  const minimalViewUser = {
    _id: fullUser._id,
    username: fullUser.username,
    profileImgUrl: fullUser.profileImgUrl,
  }

  return minimalViewUser
}

//activities:
async function addActivity(userId, externalUserId, activityType, data) {
  if (userId === externalUserId) return
  const userCollection = await dbService.getCollection(USER_KEY)

  const activity = {
    id: utilService.makeId(),
    type: activityType,
    externalBy: externalUserId,
    data,
    createdAt: Date.now(),
  }

  await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { activities: activity } }
  )

  const viewActivity = await getViewActivity(userId, activity.id)
  emitToRoom('addExternalActivity', viewActivity, userId)
  return viewActivity
}

async function removeActivity(userId, externalUserId, activityType, data) {
  if (userId === externalUserId) return
  const userCollection = await dbService.getCollection(USER_KEY)

  const user = await userCollection.findOne({ _id: ObjectId(userId) })
  if (!user) throw Error('cannot find user')
  const { activities } = user

  //activity from a post type:
  if (activityType === 'postManipulation') {
    const activity = activities.find((currAct) => {
      const matchPost = data.postId === currAct.data.postId
      const matchManipulationType =
        data.manipulationType === currAct.data.manipulationType
      const matchExternalUserId = externalUserId === currAct.externalBy
      return matchPost && matchManipulationType && matchExternalUserId
    })
    if (!activity) return

    const pullingProccess = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { activities: { id: JSON.parse(JSON.stringify(activity.id)) } } }
    )
    emitToRoom('removeExternalActivity', activity, userId)

    return 'deleted'
  } else if (activityType === 'follow') {
    const activity = activities.find((currAct) => {
      return currAct.userId === userId && currAct.externalBy === externalUserId
    })
    if (!activity) return

    const pullingProccess = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { activities: { id: JSON.parse(JSON.stringify(activity.id)) } } }
    )
    emitToRoom('removeExternalActivity', activity, userId)

    return 'deleted'
  }
}

async function getViewActivities(userId) {
  const collection = await dbService.getCollection(USER_KEY)
  const user = await collection.findOne({ _id: ObjectId(userId) })
  const prmViewActivities = user.activities.map((currAct) =>
    getViewActivity(userId, currAct.id)
  )
  return await Promise.all(prmViewActivities)
}

async function getActivity(userId, activityId) {
  const collection = await dbService.getCollection(USER_KEY)
  const user = await collection.findOne({ _id: ObjectId(userId) })
  return user.activities.find((currAct) => currAct.id === activityId)
}

async function getViewActivity(userId, activityId) {
  const collection = await dbService.getCollection(USER_KEY)
  const user = await collection.findOne({ _id: ObjectId(userId) })
  const activity = user.activities.find((currAct) => currAct.id === activityId)

  //user aggregation
  const viewExternalby = await getMinimalViewUser(activity.externalBy)
  activity.externalBy = viewExternalby

  //post activity-type aggregation:
  if (activity.type === 'postManipulation') {
    const postCollection = await dbService.getCollection('post')
    const post = await postCollection.findOne({
      _id: ObjectId(activity.data.postId),
    })
    activity.data.imgUrl = Array.isArray(post.imgUrl)
      ? post.imgUrl[0]
      : post.imgUrl

    if (activity.data.manipulationType === 'comment') {
      const comment = post.comments.find(
        (currComment) => currComment.id === activity.data.commentId
      )
      activity.data.txt = comment.txt
    }
  }

  return activity
}
