import { httpService } from './http.service'

export const userService = {
  getViewActivities,
}

async function getViewActivities() {
  return await httpService.get('user/activity')
}
