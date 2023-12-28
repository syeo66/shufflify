import Dexie, { type Table } from 'dexie'

export interface Track {
  id: string
  playlistId: string
  isSynced: boolean
}

export class ShufflifyDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Track>

  constructor() {
    super('shufflify')
    this.version(1).stores({
      tracks: 'id, playlistId, isSynced',
    })
  }
}

export const db = new ShufflifyDexie()
