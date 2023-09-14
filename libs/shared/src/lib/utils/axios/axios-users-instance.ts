import axios from 'axios'
import {JWT_LOCALSTORAGE_KEY} from '../../config'
import {refreshJwt} from '../refresh-jwt'
import {getItemFromLocalStorage} from '../storage'
import {Env, readFromEnv} from '../../environments'

export const USERS_API_URL = readFromEnv(Env.usersApi)
export const axiosUsersAuthInstance = axios.create({
  baseURL: USERS_API_URL,
  headers: {
    authorization: getUserToken() || '',
  },
  timeout: 5000,
})

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

axiosUsersAuthInstance.interceptors.request.use(
  // Check JWT's validity before request is sent
  async function onFulfilled(config) {
    const accessToken = await refreshJwt()
    // eslint-disable-next-line no-param-reassign
    ;(config.headers as unknown as Record<string, unknown>).authorization = accessToken
    return config
  },
  // Retry 3 times if the call fails
  function onRejected(error) {
    if (error.response && error.response.status >= 500) {
      const config = error.config
      config.retryCount = config.retryCount || 0

      if (config.retryCount < MAX_RETRY_ATTEMPTS) {
        config.retryCount += 1
        return new Promise((resolve) =>
          setTimeout(() => resolve(axios.request(config)), RETRY_DELAY_MS),
        )
      }
    }
    return Promise.reject(error)
  },
)

function getUserToken() {
  try {
    if (typeof window !== 'undefined') {
      return getItemFromLocalStorage<string>(JWT_LOCALSTORAGE_KEY)
    }
    return null
  } catch {
    return null
  }
}
