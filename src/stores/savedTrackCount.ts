import { writable } from 'svelte/store'
import getToken from '../functions/getToken'
import { tracksResponseSchema } from '../types'

function createSavedTrackCountStore() {
  const { subscribe, set } = writable<number>(0)

  async function getTrackCount() {
    const url = 'https://api.spotify.com/v1/me/tracks?limit=1'

    const response = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    const data = await response.json()

    const parsedData = tracksResponseSchema.safeParse(data)
    if (parsedData.success) {
      set(parsedData.data.total)
    }

    if (!parsedData.success) {
      console.log(parsedData.error)
    }
  }

  void getTrackCount()

  return {
    subscribe,
  }
}

export const savedTrackCount = createSavedTrackCountStore()
