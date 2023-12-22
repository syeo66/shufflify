const getToken = () => {
  const token = localStorage.getItem('token')

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return !token ? null : token
}

export default getToken
