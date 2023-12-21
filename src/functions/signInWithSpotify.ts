const signInWithSpotify = () => {
  const { VITE_CLIENT_ID: CLIENT_ID } = import.meta.env

  const appUrl = encodeURIComponent(window.location.href.split('#')[0])
  const scopes =
    'user-library-read playlist-read-private playlist-modify-private user-modify-playback-state user-read-playback-state'
  const url =
    `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${appUrl}&response_type=token` +
      `&scope=${encodeURIComponent(scopes)}`
  window.location.href = url
}

export default signInWithSpotify
