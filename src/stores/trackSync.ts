import { writable } from 'svelte/store'
import { tracksResponseSchema, type Playlists, type Playlist } from '../types'
import getToken from '../functions/getToken'
import { db } from '../db'

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
        await db.tracks.bulkPut(
          tracks.data.items.map((track) => ({
            isSynced: 1,
            playlistId: playlist.id,
            timestamp: Date.now(),
            trackId: track.track.id,
          })),
        )

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
    set(currentProgress)

    await db.tracks.toCollection().modify((track) => {
      track.isSynced = 0
    })

    // TODO: add sync of liked tracks
    // this will require a more
    // generic interface for
    // the fetchTracks
    // function

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

    await db.tracks.where('isSynced').equals(0).delete()

    currentProgress.isLoading = false
    set(currentProgress)
  }

  return {
    subscribe,
    start: sync,
  }
}

export const trackSync = createTrackSyncStore()
