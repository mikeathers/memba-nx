import {ENDPOINTS} from '../config'
import {axiosTenantsAuthInstance} from '../utils'
import {MembaApp} from '../types'

interface GetAppProps {
  url: string
}

export const getApp = async (props: GetAppProps): Promise<MembaApp | null> => {
  const {url} = props
  const URL = `${ENDPOINTS.GET_APP}/${url}`

  const response = await axiosTenantsAuthInstance.request<MembaApp | null>({
    url: URL,
    method: 'GET',
  })

  return response.data
}
