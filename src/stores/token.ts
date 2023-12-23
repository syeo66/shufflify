import { writable } from 'svelte/store'

export const TOKEN_KEY = 'shufflify.token'

function createTokenStore () {
  const { subscribe, set } = writable<string>('')

  const currentToken = localStorage.getItem(TOKEN_KEY) ?? ''
  set(currentToken)

  const setToken = (token: string) => {
    if (token === '') {
      localStorage.removeItem(TOKEN_KEY)
    } else {
      localStorage.setItem(TOKEN_KEY, token)
    }
    set(token)
  }

  return {
    subscribe,
    set: setToken
  }
}

export const token = createTokenStore()
