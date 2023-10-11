import axios from 'axios'
import {refreshJwt} from '../refresh-jwt'
import {JWT_LOCALSTORAGE_KEY} from '../../config'
import {getItemFromLocalStorage} from '../storage'
import {Env, readFromEnv} from '../../environments'
import axiosRetry from 'axios-retry'
import {axiosUsersAuthInstance} from './axios-users-instance'

export const PRE_SIGNED_API_URL = readFromEnv(Env.preSignedUrl)

export const axiosUploadsInstance = axios.create({
  baseURL: PRE_SIGNED_API_URL,
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

axiosUploadsInstance.interceptors.request.use(
  async (response) => {
    const accessToken = await refreshJwt()
    // eslint-disable-next-line no-param-reassign
    ;(response.headers as unknown as Record<string, unknown>).authorization = accessToken
    return response
  },
  (error) => console.log('REQUEST ERROR', error),
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
