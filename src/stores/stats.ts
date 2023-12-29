import { derived } from 'svelte/store'
import { configuration } from './configuration'
import { playlists } from './playlists'
import { savedTrackCount } from './savedTrackCount'
import type { Playlists } from '../types'

type Stores = [typeof configuration, typeof playlists, typeof savedTrackCount]
interface StoreData {
  selectedTrackCount: number
  selectedPlaylists: Playlists
}

const INITIAL_STATE = { selectedTrackCount: 0, selectedPlaylists: [] }

export const stats = derived<Stores, StoreData>([configuration, playlists, savedTrackCount], ([$c, $p, $s], set) => {
  if ($p.isLoading) {
    set(INITIAL_STATE)
  }

  const selectedPlaylists = $p.data?.filter((playlist) => $c.checkedPlaylists.includes(playlist.id)) ?? []

  const selectedTrackCount =
    ($c.syncFavorites ? $s : 0) +
    (selectedPlaylists.reduce((acc, playlist) => {
      return acc + playlist.tracks.total
    }, 0) ?? 0)

  set({ selectedTrackCount, selectedPlaylists })
})
