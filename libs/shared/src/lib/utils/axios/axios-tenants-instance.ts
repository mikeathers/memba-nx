import axios from 'axios'
import {refreshJwt} from '../refresh-jwt'
import {JWT_LOCALSTORAGE_KEY} from '../../config'
import {getItemFromLocalStorage} from '../storage'
import {Env, readFromEnv} from '../../environments'

export const TENANTS_API_URL = readFromEnv(Env.tenantsApi)

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

export const axiosTenantsAuthInstance = axios.create({
  baseURL: TENANTS_API_URL,
  headers: {
    authorization: getUserToken() || '',
  },
  timeout: 5000,
})

axiosTenantsAuthInstance.interceptors.request.use(
  // Check JWT's validity before request is sent
  async function onFulfilled(config) {
    const accessToken = await refreshJwt()
    // eslint-disable-next-line no-param-reassign
    ;(config.headers as unknown as Record<string, unknown>).authorization = accessToken
    return config
  },
  // Reject if the call to Amplify errors out
  function onRejected(error) {
    // console.log('Error: ', error)
    // return Promise.reject(error)

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
