import {ENDPOINTS} from '../config'
import {axiosUsersAuthInstance} from '../utils'
import {MembaUser} from '../types'

interface GetUserAccountProps {
  emailAddress: string
}

export const getUserAccount = async (
  props: GetUserAccountProps,
): Promise<MembaUser | null> => {
  const {emailAddress} = props
  const URL = `${ENDPOINTS.GET_USER_ACCOUNT}/${emailAddress}`

  const response = await axiosUsersAuthInstance.request<MembaUser | null>({
    url: URL,
    method: 'GET',
    data: props,
  })

  return response.data
}
