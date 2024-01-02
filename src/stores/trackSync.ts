import { writable } from 'svelte/store'

import { db } from '../db'
import { loadConfig } from './configuration'
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
  progress: number
  total: number
  isLoading: boolean
}

interface FetchTracksInput {
  url: string
  id: string
}

const INITIAL_PROGRESS = { data: {}, isLoading: false, progress: 0, total: 0 }

function createTrackSyncStore() {
  const { subscribe, set } = writable<Progress>(INITIAL_PROGRESS)

  let currentProgress: Progress = INITIAL_PROGRESS

  async function fetchTracks(input: FetchTracksInput) {
    let url = input.url

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
            playlistId: input.id,
            timestamp: Date.now(),
            trackId: track.track.id,
          })),
        )

        url = tracks.data.next ?? ''

        if (currentProgress.data[input.id] === undefined) {
          currentProgress.total += tracks.data.total
          currentProgress.data[input.id] = {
            progress: 0,
            total: tracks.data.total,
          }
        }
        currentProgress.data[input.id].progress += tracks.data.items.length
        currentProgress.progress += tracks.data.items.length
        set(currentProgress)
      }
      if (!tracks.success) {
        console.error(tracks.error)
      }
    }
  }

  async function sync(playlists: Playlists) {
    currentProgress = structuredClone(INITIAL_PROGRESS)
    currentProgress.isLoading = true
    set(currentProgress)

    await db.tracks.clear()

    const fetching = playlists.map(async (playlist) => {
      currentProgress.data[playlist.id] = {
        progress: 0,
        total: playlist.tracks.total,
      }
      currentProgress.total += playlist.tracks.total
      set(currentProgress)

      await fetchTracks({ url: playlist.tracks.href, id: playlist.id })
    })

    const config = loadConfig()
    if (config.syncFavorites) {
      fetching.push(fetchTracks({ url: 'https://api.spotify.com/v1/me/tracks?limit=50', id: 'liked' }))
    }

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
