import { writable } from 'svelte/store'
import getToken from '../functions/getToken'
import { devicesResponseSchema } from '../types'

function createAvailableDeviceStore() {
  const { subscribe, set } = writable<string | null>(null)

  async function getCurrentDevice() {
    const url = 'https://api.spotify.com/v1/me/player/devices'

    const token = getToken()

    if (token === null || token === '') {
      set(null)
      return
    }

    try {
      const response = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const data = await response.json()

      const parsedData = devicesResponseSchema.safeParse(data)
      if (parsedData.success) {
        const name = parsedData.data.devices.find((device) => device.is_active)?.name ?? null
        set(name)
      }

      if (!parsedData.success) {
        set(null)
      }
    } catch (err) {
      set(null)
    }

    setTimeout(getCurrentDevice, 5000)
  }

  void getCurrentDevice()

  return {
    subscribe,
  }
}

export const availableDevice = createAvailableDeviceStore()
