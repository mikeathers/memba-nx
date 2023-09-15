import {create} from 'zustand'
import {getBasicApp, getTenantAccount, getUserAccount} from '../../services'
import {MembaApp, MembaUser} from '../../types'

export interface MembaStore {
  getTenantUser: (emailAddress: string) => Promise<void>
  user: MembaUser | null
  getUser: (emailAddress: string) => Promise<void>
  app: MembaApp | null
  getApp: () => Promise<void>
}

export const useMembaDetails = create<MembaStore>((set) => ({
  getTenantUser: async (emailAddress: string) => {
    const response = await getTenantAccount({emailAddress})
    console.log('tenant:', response)
    set({user: response})
  },
  user: null,
  getUser: async (emailAddress: string) => {
    const response = await getUserAccount({emailAddress})
    console.log('user:', response)
    set({user: response})
  },
  app: null,
  getApp: async () => {
    const fullUrl = new URL(window.location.href)
    const hostName = fullUrl.hostname
    const url = hostName.includes('localhost') ? 'mikesgym.dev.memba.co.uk' : hostName
    const app = await getBasicApp({url})
    set({app})
  },
}))
