import { z } from 'zod'

export const userSchema = z.object({
  display_name: z.string(),
  external_urls: z.object({
    spotify: z.string()
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(
    z.object({
      url: z.string(),
      height: z.number(),
      width: z.number()
    })
  ),
  type: z.string(),
  uri: z.string(),
  followers: z.object({
    href: z.null(),
    total: z.number()
  })
})
export type User = z.infer<typeof userSchema>
