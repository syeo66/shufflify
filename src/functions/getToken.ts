import { TOKEN_KEY } from '../stores/token'

const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return !token ? null : token
}

export default getToken
