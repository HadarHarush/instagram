import { postiService } from './posti.service'

export const postiController = {
  getPosts,
  getPost,
}

async function getPosts(data) {
  return await postiService.getPosts(data.fromIdx, data.toIdx)
}

async function getPost(data) {
  if (data.viewType)
    return await postiService.getPost(data.postId, data.viewType)
  return await postiService.getPost(data.postId)
}
