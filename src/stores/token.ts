import { writable  } from 'svelte/store';


function createTokenStore() {
  const { subscribe, set } = writable<string>("");

  let currentToken = localStorage.getItem('token') || ""
  set(currentToken);

  const setToken = (token: string) => {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
    set(token);
  }

  return {
    subscribe,
    set: setToken,
  };
}

export const token = createTokenStore();

