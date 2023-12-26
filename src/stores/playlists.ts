import { writable } from 'svelte/store'
import type { Playlists } from '../types'
import retrievePlaylists from '../queries/retrievePlaylists'

const DEFAULT_URL = 'https://api.spotify.com/v1/me/playlists?limit=50'

function createPlaylistsStore() {
  const { subscribe, set } = writable<Playlists | null>(null)

  async function fetchPlaylists() {
    let url = DEFAULT_URL

    const allPlaylists: Playlists = []

    while (url !== '') {
      const playlists = await retrievePlaylists(url)
      allPlaylists.push(...(playlists?.items ?? []))
      set(allPlaylists)
      url = playlists?.next ?? ''
    }
  }

  void fetchPlaylists()

  async function refetch() {
    set(null)
    await fetchPlaylists()
  }

  return {
    subscribe,
    refetch,
  }
}

export const playlists = createPlaylistsStore()
