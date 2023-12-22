import getToken from '../functions/getToken'
import { userSchema, type User } from '../types'

const retrieveUserData = async (): Promise<User> => {
  const authenticated = getToken()

  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'get',
    headers: {
      Authorization: `Bearer ${authenticated}`
    }
  })

  return userSchema.parse(await response.json())
}

export default retrieveUserData
