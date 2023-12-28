import { derived } from 'svelte/store'
import { configuration } from './configuration'
import { playlists } from './playlists'
import { savedTrackCount } from './savedTrackCount'

type Stores = [typeof configuration, typeof playlists, typeof savedTrackCount]
type StoreData = {
  selectedTrackCount: number
} | null

export const stats = derived<Stores, StoreData>([configuration, playlists, savedTrackCount], ([$c, $p, $s], set) => {
  if ($p.isLoading) {
    set(null)
  }

  const selectedTrackCount =
    ($c.syncFavorites ? $s : 0) +
    ($p.data?.reduce((acc, playlist) => {
      return acc + ($c.checkedPlaylists.includes(playlist.id) ? playlist.tracks.total : 0)
    }, 0) ?? 0)

  set({ selectedTrackCount })
})
