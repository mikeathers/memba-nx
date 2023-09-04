import {ENDPOINTS} from '../config'
import {NewCustomerFormDetails, RegisterTenantResponse} from '../types'
import {axiosUsersAuthInstance} from '../utils/axios'

interface CreateTenantAccountProps extends NewCustomerFormDetails {
  tier: string
}

export const createTenantAccount = async (
  props: CreateTenantAccountProps,
): Promise<RegisterTenantResponse | null> => {
  const URL = ENDPOINTS.CREATE_TENANT_ACCOUNT

  const response = await axiosUsersAuthInstance.request<RegisterTenantResponse | null>({
    url: URL,
    method: 'POST',
    data: props,
  })

  return response.data
}
