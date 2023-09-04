import {ENDPOINTS} from '../config'
import {axiosUsersAuthInstance} from '../utils/axios'
import {MembaUser, UserMembership} from '../types'

export interface CreateUserAccountProps {
  emailAddress: string
  password: string
  firstName: string
  lastName: string
  groupName: string
  appId: string
  signUpRedirectUrl: string
  membership: UserMembership
}

export const createUserAccount = async (
  props: CreateUserAccountProps,
): Promise<MembaUser | null> => {
  const URL = ENDPOINTS.CREATE_USER_ACCOUNT

  const response = await axiosUsersAuthInstance.request<MembaUser | null>({
    url: URL,
    method: 'POST',
    data: props,
  })

  return response.data
}
