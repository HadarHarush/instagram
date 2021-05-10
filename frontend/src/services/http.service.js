import Axios from 'axios'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'

var axios = Axios.create({
  withCredentials: true,
})

export const httpService = {
  async get(endpoint, queryParams) {
    try {
      return ajax(endpoint, 'GET', null, queryParams)
      // return await serverDemo.demoRouter(endpoint, 'GET', data)
    } catch (err) {}
  },
  async post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
    // return await serverDemo.demoRouter(endpoint, 'POST', data)
  },
  async put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  async delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  },
}

// httpService.post('api/auth/login', {
//   username: 'avraham_harush1',
//   password: 'avraham_harush1',
// })

// httpService.post('api/auth/signup', {
//   username: 'efrat_harush1',
//   password: 'efrat_harush1',
//   fullname: 'efrat harush',
//   mail: 'efratharush@gmail.com',
// })

async function ajax(endpoint, method = 'get', data = null, params = null) {
  try {
    console.log('sending ajax reuest: ')
    console.log(`${BASE_URL}${endpoint}`)
    console.log('query params:', params)
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params,
    })
    return res.data
  } catch (err) {
    console.log(
      `Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: ${data}`
    )
    console.dir(err)
    if (err.response && err.response.status === 401) {
      window.location.assign('/#/auth')
    }
    throw err
  }
}
