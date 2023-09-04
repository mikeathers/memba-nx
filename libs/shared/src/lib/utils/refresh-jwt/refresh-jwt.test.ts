import {Auth} from '@aws-amplify/auth'
import {waitFor} from '@testing-library/react'
import mocked = jest.mocked

import {removeItemFromLocalStorage, setItemInLocalStorage} from '../storage'
import {mockCognitoUserSession} from '../../test-support'
import {refreshJwt} from './refresh-jwt'

jest.mock('../storage')

const mockSetItemInStorage = mocked(setItemInLocalStorage)
const mockRemoveItemInStorage = mocked(removeItemFromLocalStorage)

describe('Refresh Jwt', () => {
  beforeEach(() => {
    jest.spyOn(Auth, 'currentSession').mockResolvedValue(mockCognitoUserSession)
  })

  it('should call Auth current session', async () => {
    await refreshJwt()

    await waitFor(() => expect(jest.spyOn(Auth, 'currentSession')).toHaveBeenCalled())
  })

  it('should call setItemInStorage when session is found', async () => {
    await refreshJwt()

    await waitFor(() => expect(mockSetItemInStorage).toHaveBeenCalled())
  })

  it('should call removeItemFromStorage when sessions not found', async () => {
    jest.spyOn(Auth, 'currentSession').mockRejectedValue(new Error('User not found'))

    try {
      await refreshJwt()
    } catch {
      await waitFor(() => expect(mockRemoveItemInStorage).toHaveBeenCalled())
    }
  })
})
