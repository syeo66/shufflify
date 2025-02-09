import { TOKEN_KEY } from '../stores/token'

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)

  return !token ? null : token
}

export default getToken
