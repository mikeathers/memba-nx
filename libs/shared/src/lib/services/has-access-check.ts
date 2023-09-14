import {axiosTenantsAuthInstance} from '../utils'
import {ENDPOINTS} from '../config'

interface CheckIfUserCanLoginProps {
  emailAddress: string
  url: string
}
export const hasAccessCheck = async (
  props: CheckIfUserCanLoginProps,
): Promise<boolean> => {
  const {emailAddress, url} = props
  const URL = `${ENDPOINTS.HAS_ACCESS_TO_APP}?emailAddress=${emailAddress}&url=${url}`
  try {
    await axiosTenantsAuthInstance.request({
      url: URL,
      method: 'GET',
    })

    return true
  } catch (error) {
    return false
  }
}
