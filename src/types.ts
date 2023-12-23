import { z } from 'zod'

const commonConfigSchema = z.object({
  purgeOnShuffel: z.boolean(),
  randomListName: z.string(),
})
export const configurationSchema = z.discriminatedUnion('amountType', [
  commonConfigSchema.extend({
    amountType: z.literal('minutes'),
    trackMinutes: z.number().min(1),
  }),
  commonConfigSchema.extend({
    amountType: z.literal('trackcount'),
    trackCount: z.number().min(1),
  }),
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
