import { writable } from 'svelte/store'
import { tracksResponseSchema, type Playlists } from '../types'
import getToken from '../functions/getToken'

interface Progress {
  data: Record<
    string,
    {
      progress: number
      total: number
    }
  >
  isLoading: boolean
}

const INITIAL_PROGRESS = { data: {}, isLoading: false }

function createTrackSyncStore() {
  const { subscribe, set } = writable<Progress>(INITIAL_PROGRESS)

  let currentProgress: Progress = INITIAL_PROGRESS

  async function fetchTracks(url: string | null) {
    while (url !== '' && url !== null) {
      const response = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      const tracks = tracksResponseSchema.safeParse(await response.json())

      if (tracks.success) {
        url = tracks.data.next ?? null
        // TODO: store track in db using dexie
      }
      if (!tracks.success) {
        console.error(tracks.error)
      }
    }
  }

  async function sync(playlists: Playlists) {
    currentProgress = INITIAL_PROGRESS
    currentProgress.isLoading = true

    const fetching = playlists.map(async (playlist) => {
      currentProgress.data[playlist.id] = {
        progress: 0,
        total: playlist.tracks.total,
      }
      set(currentProgress)

      await fetchTracks(playlist.tracks.href)
    })

    await Promise.all(fetching)
    currentProgress.isLoading = false
    set(currentProgress)
  }

  return {
    subscribe,
    start: sync,
  }
}

export const trackSync = createTrackSyncStore()
