import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {getBasicApp, getTenantAccount, getUserAccount} from '../../services'
import {MembaApp, MembaUser} from '../../types'

export interface MembaStore {
  getTenantUser: (emailAddress: string) => Promise<void>
  user: MembaUser | null
  getUser: (emailAddress: string) => Promise<void>
  updateUser: (newUserDetails: MembaUser) => void
  app: MembaApp | null
  getApp: (url?: string) => Promise<void>
}

export const useMembaDetails = create<MembaStore>()(
  persist(
    (set, get) => ({
      getTenantUser: async (emailAddress: string) => {
        const response = await getTenantAccount({emailAddress})
        set({user: response})
      },
      user: null,
      getUser: async (emailAddress: string) => {
        const response = await getUserAccount({emailAddress})
        set({user: response})
      },
      updateUser: async (newUserDetails: MembaUser) => {
        console.log('hee')
        set({user: newUserDetails})
      },
      app: null,
      getApp: async (knownAppUrl?: string) => {
        const fullUrl = new URL(window.location.href)
        const hostName = fullUrl.hostname
        const url = (knownAppUrl || hostName).replace('https://', '')
        const urlToRetrieve = hostName.includes('localhost')
          ? 'mikesgym.dev.memba.co.uk'
          : url

        const app = await getBasicApp({url: urlToRetrieve})
        set({app})
      },
    }),
    {
      name: 'memba-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
