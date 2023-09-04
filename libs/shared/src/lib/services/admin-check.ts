import {ENDPOINTS} from '../config'
import {axiosTenantsAuthInstance} from '../utils/axios'

interface AdminCheckProps {
  emailAddress: string
}

export const adminCheck = async (props: AdminCheckProps): Promise<boolean> => {
  const {emailAddress} = props
  const URL = `${ENDPOINTS.ADMIN_CHECK}/${emailAddress}`

  const response = await axiosTenantsAuthInstance.request<boolean>({
    url: URL,
    method: 'GET',
    data: props,
  })

  return response?.data
}
