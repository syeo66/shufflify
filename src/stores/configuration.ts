import { writable } from 'svelte/store'
import { configurationSchema, type Configuration } from '../types'

const CONFIG_KEY = 'shufflify.config'
const DEFAULT_PLAYLIST_NAME = 'Advanced Shuffle'

const initialConfig: Configuration = {
  addDateToListName: false,
  amountType: 'minutes',
  checkedPlaylists: [],
  purgeOnShuffle: true,
  randomListName: DEFAULT_PLAYLIST_NAME,
  syncFavorites: true,
  trackCount: '30',
  trackMinutes: '120',
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

export function loadConfig(): Configuration {
  const value = localStorage.getItem(CONFIG_KEY) ?? ''

  try {
    return configurationSchema.parse(JSON.parse(value))
  } catch {
    return initialConfig
  }
}

export const configuration = createConfigurationStore()
