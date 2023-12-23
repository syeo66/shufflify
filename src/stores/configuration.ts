import { writable } from 'svelte/store'
import { z } from 'zod'

const CONFIG_KEY = 'shufflify.config'

const configurationSchema = z.object({

})
type Configuration = z.infer<typeof configurationSchema>

const initialConfig: Configuration = {}

function createConfigurationStore () {
  const { subscribe, set } = writable<Configuration>(initialConfig)

  const currentConfig = loadConfig()
  set(currentConfig)

  const setConfiguration = (config: Configuration) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    set(config)
  }

  return {
    subscribe,
    set: setConfiguration
  }
}

const loadConfig = (): Configuration => {
  const value = localStorage.getItem(CONFIG_KEY) ?? ''

  try {
    return configurationSchema.parse(JSON.parse(value))
  } catch {
    return {}
  }
}

export const configuration = createConfigurationStore()
