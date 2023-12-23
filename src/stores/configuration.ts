import { writable } from 'svelte/store'
import { z } from 'zod'

const CONFIG_KEY = 'shufflify.config'

const configurationSchema = z.discriminatedUnion('amountType', [
  z.object({
    amountType: z.literal('minutes'),
    trackMinutes: z.number().min(1),
  }),
  z.object({
    amountType: z.literal('trackcount'),
    trackCount: z.number().min(1),
  }),
])
type Configuration = z.infer<typeof configurationSchema>

const initialConfig: Configuration = {
  amountType: 'minutes',
  trackMinutes: 120,
}

function createConfigurationStore() {
  const { subscribe, set } = writable<Configuration>(initialConfig)

  const currentConfig = loadConfig()
  set(currentConfig)

  function setConfiguration(config: Configuration) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    set(config)
  }

  return {
    subscribe,
    set: setConfiguration,
  }
}

function loadConfig(): Configuration {
  const value = localStorage.getItem(CONFIG_KEY) ?? ''

  try {
    return configurationSchema.parse(JSON.parse(value))
  } catch {
    return initialConfig
  }
}

export const configuration = createConfigurationStore()
