import getToken from '../functions/getToken'
import { playlistResponseSchema, type PlaylistResponse } from '../types'

async function retrievePlaylists(
  url = 'https://api.spotify.com/v1/me/playlists?limit=50',
): Promise<PlaylistResponse | null> {
  const authenticated = getToken()
  if (authenticated === null) {
    return null
  }

  const playlistData = await fetch(url, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${authenticated}`,
    },
  })

  const playlistObject = await playlistData.json()

  return playlistResponseSchema.parse(playlistObject)
}

export default retrievePlaylists
