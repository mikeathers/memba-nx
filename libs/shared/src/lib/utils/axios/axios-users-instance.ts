import axios from 'axios'
import axiosRetry from 'axios-retry'

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

axiosRetry(axiosUsersAuthInstance, {
  retries: MAX_RETRY_ATTEMPTS,
  retryCondition: () => true,
  retryDelay: (retryCount) => {
    return retryCount * RETRY_DELAY_MS
  },
})

axiosUsersAuthInstance.interceptors.request.use(
  async (response) => {
    const accessToken = await refreshJwt()
    // eslint-disable-next-line no-param-reassign
    ;(response.headers as unknown as Record<string, unknown>).authorization = accessToken
    return response
  },
  (error) => console.log('REEQUEST ERROR', error),
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
