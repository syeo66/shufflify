import Dexie, { type Table } from 'dexie'

export interface Track {
  duration_ms: number
  id?: number
  isSynced: 0 | 1
  playlistId: string
  timestamp: number
  trackId: string
}

export class ShufflifyDexie extends Dexie {
  // 'tracks' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tracks!: Table<Track>

  constructor() {
    super('shufflify')
    this.version(1).stores({
      tracks: '&[trackId+playlistId], trackId, playlistId, isSynced, timestamp',
    })
  }
}

export const db = new ShufflifyDexie()
