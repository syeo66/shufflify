import { z } from 'zod'

const commonConfigSchema = z.object({
  purgeOnShuffel: z.boolean(),
  randomListName: z.string(),
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
  description: z.string(),
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
