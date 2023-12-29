import { writable } from 'svelte/store'
import { tracksResponseSchema, type Playlists, type Playlist } from '../types'
import getToken from '../functions/getToken'

interface Progress {
  data: Record<
    string,
    {
      progress: number
      total: number
    }
  >
  progress: number
  total: number
  isLoading: boolean
}

const INITIAL_PROGRESS = { data: {}, isLoading: false, progress: 0, total: 0 }

function createTrackSyncStore() {
  const { subscribe, set } = writable<Progress>(INITIAL_PROGRESS)

  let currentProgress: Progress = INITIAL_PROGRESS

  async function fetchTracks(playlist: Playlist) {
    let url = playlist.tracks.href

    while (url !== '') {
      const response = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const tracks = tracksResponseSchema.safeParse(await response.json())

      if (tracks.success) {
        // TODO: store track in db using dexie

        url = tracks.data.next ?? ''
        currentProgress.data[playlist.id].progress += tracks.data.items.length
        currentProgress.progress += tracks.data.items.length
        set(currentProgress)
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
      currentProgress.total += playlist.tracks.total
      set(currentProgress)

      await fetchTracks(playlist)
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
