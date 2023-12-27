import { writable } from 'svelte/store'
import type { Playlists } from '../types'
import retrievePlaylists from '../queries/retrievePlaylists'

const DEFAULT_URL = 'https://api.spotify.com/v1/me/playlists?limit=50'

interface PlaylistsStore {
  data: Playlists | null
  isLoading: boolean
}

const INITIAL_STATE = {
  data: null,
  isLoading: false,
}

function createPlaylistsStore() {
  const { subscribe, set } = writable<PlaylistsStore>(INITIAL_STATE)

  async function fetchPlaylists() {
    let url = DEFAULT_URL

    const allPlaylists: Playlists = []
    set({ data: allPlaylists, isLoading: true })

    while (url !== '') {
      const playlists = await retrievePlaylists(url)
      allPlaylists.push(...(playlists?.items ?? []))
      set({ data: allPlaylists, isLoading: true })
      url = playlists?.next ?? ''
    }

    set({ data: allPlaylists, isLoading: false })
  }

  void fetchPlaylists()

  async function refetch() {
    set(INITIAL_STATE)
    await fetchPlaylists()
  }

  return {
    subscribe,
    refetch,
  }
}

export const playlists = createPlaylistsStore()
