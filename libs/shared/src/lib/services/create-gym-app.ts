import {ENDPOINTS} from '../config'
import {axiosTenantsAuthInstance} from '../utils'
import {GetTenantUserApiResponse, MembaUser, MembershipPricing} from '../types'

export interface CreateGymAppProps {
  tenantId: string
  gymName: string
  tier: string
  memberships: MembershipPricing[]
  tenantAdminEmailAddress: string
  user: MembaUser | null
}
export const createGymApp = async (
  props: CreateGymAppProps,
): Promise<GetTenantUserApiResponse | null> => {
  const URL = ENDPOINTS.CREATE_GYM_APP

  const response =
    await axiosTenantsAuthInstance.request<GetTenantUserApiResponse | null>({
      url: URL,
      method: 'POST',
      data: props,
    })

  return response?.data
}
