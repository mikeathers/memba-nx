import {ENDPOINTS} from '../config'
import {axiosUsersAuthInstance} from '../utils'
import {MembaUser} from '../types'

export const updateUsersAccount = async (props: MembaUser): Promise<MembaUser | null> => {
  const URL = `${ENDPOINTS.UPDATE_USER_ACCOUNT}`

  const response = await axiosUsersAuthInstance.request<MembaUser | null>({
    url: URL,
    method: 'PUT',
    data: props,
  })

  return response.data
}
