import { postiController } from './posti.controller'

const express = require('express')
const router = express.Router()

// router.post('/login', login)
// router.post('/signup', signup)
// router.post('/logout', logout)

router.get('/feed', 'getFeed')
router.get('/:postId', 'getPost')

module.exports = router

// export const postiRouter = {
//   async route(endpoint, method, data) {
//     console.log('riched posti routing', arguments)
//     if (endpoint.includes('/feed')) {
//       return await postiController.getPosts(data)
//     }
//     if (endpoint.includes('') && data.postId) {
//       return await postiController.getPost(data)
//     }
//   },
// }
