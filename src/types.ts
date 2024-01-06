import { z } from 'zod'

const commonConfigSchema = z.object({
  checkedPlaylists: z.array(z.string()),
  purgeOnShuffle: z.boolean(),
  randomListName: z.string(),
  syncFavorites: z.boolean(),
})
export const configurationSchema = z.discriminatedUnion('amountType', [
  commonConfigSchema
    .extend({
      amountType: z.literal('minutes'),
      trackMinutes: z.string().default('120'),
    })
    .passthrough(),
  commonConfigSchema
    .extend({
      amountType: z.literal('trackcount'),
      trackCount: z.string().default('30'),
    })
    .passthrough(),
])
export type Configuration = z.infer<typeof configurationSchema>

export const userSchema = z.object({
  display_name: z.string(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(
    z.object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    }),
  ),
  type: z.string(),
  uri: z.string(),
  followers: z.object({
    href: z.null(),
    total: z.number(),
  }),
})
export type User = z.infer<typeof userSchema>

export const imageSchema = z.object({
  height: z.number().nullable(),
  url: z.string(),
  width: z.number().nullable(),
})

export const playlistSchema = z.object({
  collaborative: z.boolean(),
  description: z.string().nullable(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(imageSchema).optional(),
  name: z.string(),
  owner: z.object({
    display_name: z.string(),
  }),
  snapshot_id: z.string().optional(),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
})
export type Playlist = z.infer<typeof playlistSchema>

export const playlistsSchema = z.array(playlistSchema)
export type Playlists = z.infer<typeof playlistsSchema>

export const playlistResponseSchema = z.object({
  href: z.string(),
  items: playlistsSchema,
  limit: z.number(),
  next: z.string().optional().nullable(),
  offset: z.number(),
  previous: z.string().optional().nullable(),
  total: z.number(),
})
export type PlaylistResponse = z.infer<typeof playlistResponseSchema>

export const artistSchema = z.object({
  external_urls: z.object({
    spotify: z.string(),
  }),
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
  display_name: z.string().optional().nullable(),
})
export type Artist = z.infer<typeof artistSchema>

export const albumSchema = z.object({
  album_type: z.string(),
  artists: z.array(artistSchema),
  id: z.string(),
  images: z.array(imageSchema),
  name: z.string(),
  release_date: z.string(),
  total_tracks: z.number(),
})
export type Album = z.infer<typeof albumSchema>

export const trackSchema = z.object({
  album: albumSchema,
  artists: z.array(artistSchema),
  duration_ms: z.number(),
  id: z.string(),
  name: z.string(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.string(),
  uri: z.string(),
})
export type Track = z.infer<typeof trackSchema>

export const itemSchema = z.object({
  added_at: z.string(),
  track: trackSchema,
})
export type Item = z.infer<typeof itemSchema>

export const tracksSchema = z.array(itemSchema)
export type Tracks = z.infer<typeof tracksSchema>

export const tracksResponseSchema = z.object({
  href: z.string(),
  items: tracksSchema,
  limit: z.number(),
  next: z.string().optional().nullable(),
  offset: z.number(),
  previous: z.string().optional().nullable(),
  total: z.number(),
})
export type TrackResponse = z.infer<typeof tracksResponseSchema>
