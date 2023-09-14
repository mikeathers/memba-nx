import {ENDPOINTS} from '../config'
import {axiosUsersAuthInstance} from '../utils'
import {MembaUser} from '../types'

interface GetTenantAccountProps {
  emailAddress: string
}

export const getTenantAccount = async (
  props: GetTenantAccountProps,
): Promise<MembaUser | null> => {
  const {emailAddress} = props
  const URL = `${ENDPOINTS.GET_TENANT_ACCOUNT}/${emailAddress}`

  const response = await axiosUsersAuthInstance.request<MembaUser | null>({
    url: URL,
    method: 'GET',
    data: props,
  })

  return response.data
}
