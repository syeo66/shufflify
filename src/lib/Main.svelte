<script lang="ts">
  import random from 'random'

  import { configuration } from '../stores/configuration'
  import { playlistSchema, type Playlist, tracksResponseSchema } from '../types'
  import { playlists } from '../stores/playlists'
  import { stats } from '../stores/stats'
  import { token } from '../stores/token'

  import Configuration from './Configuration.svelte'
  import Header from './Header.svelte'
  import Playlists from './Playlists.svelte'
  import Stats from './Stats.svelte'
  import Refresh from './icons/Refresh.svelte'
  import chunkArray from '../functions/chunkArray'
  import getToken from '../functions/getToken'

  let isShuffling = false

  $: if (!$token) {
    window.location.href = '/'
  }

  async function addRandomTracks(playlist: Playlist, trackUris: string[]) {
    const playlistId = playlist.id
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${$token}`,
      },
      body: JSON.stringify({
        uris: trackUris.map((uri) => `spotify:track:${uri}`),
        position: 0,
      }),
    })
  }

  async function createRandomPlaylist(): Promise<Playlist> {
    const url = 'https://api.spotify.com/v1/me/playlists'

    const dateString = $configuration.addDateToListName ? ` ${new Date().toISOString().substring(0, 10)}` : ''

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${$token}`,
      },
      body: JSON.stringify({
        name: $configuration.randomListName + dateString,
        description: 'Shufflify Playlist',
        public: false,
      }),
    })

    const data = await response.json()
    await playlists.refetch()
    return playlistSchema.parse(data)
  }

  function findTrackInPlaylist(playlists: { id: string; total: number }[], idx: number): [string | null, number] {
    let start = 0

    for (const playlist of playlists) {
      if (idx >= start && idx < start + playlist.total) {
        return [playlist.id, idx - start]
      }
      start += playlist.total
    }

    return [null, idx - start]
  }

  async function retrieveOneTrackFromPlaylist([playlistId, idx]: [string | null, number]) {
    const url = !playlistId
      ? `https://api.spotify.com/v1/me/tracks?offset=${idx}&limit=1`
      : `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${idx}&limit=1`

    const response = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    const jsonData = await response.json()
    const data = tracksResponseSchema.parse(jsonData)

    return data.items[0].track
  }

  let current = 0
  let target = $configuration.amountType === 'minutes' ? +$configuration.trackMinutes * 60 : +$configuration.trackCount

  async function fillRandomPlaylist(playlist: Playlist) {
    const totalCount = $stats.selectedTrackCount
    const playlists = $stats.selectedPlaylists.map(({ id, tracks: { total } }) => ({ id, total }))

    const chosen: string[] = []

    while (current < target) {
      const selectedIdx = random.int(0, totalCount - 1)
      const chosenTrack = findTrackInPlaylist(playlists, selectedIdx)
      const track = await retrieveOneTrackFromPlaylist(chosenTrack)

      const trackId = track.id
      if (!trackId) {
        break
      }
      chosen.push(trackId)
      if ($configuration.amountType === 'minutes') {
        current += (track?.duration_ms ?? 180000) / 1000
      } else {
        current += 1
      }
    }

    await Promise.all(chunkArray(chosen, 100).map((chunk) => addRandomTracks(playlist, chunk)))
  }

  async function shuffle() {
    isShuffling = true
    current = 0
    target = $configuration.amountType === 'minutes' ? +$configuration.trackMinutes * 60 : +$configuration.trackCount
    await playlists.refetch()

    let existingPlaylist =
      $playlists.data?.find((playlist) => playlist.name.startsWith($configuration.randomListName)) ?? null

    if ($configuration.purgeOnShuffle && existingPlaylist) {
      const url = `https://api.spotify.com/v1/playlists/${existingPlaylist.id}/followers`
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${$token}`,
        },
        method: 'DELETE',
        body: JSON.stringify({
          snapshot_id: existingPlaylist.snapshot_id,
        }),
      })
      existingPlaylist = null
    }

    if (!existingPlaylist) {
      existingPlaylist = await createRandomPlaylist()
    }

    await fillRandomPlaylist(existingPlaylist)
    await playlists.refetch()

    isShuffling = false
  }
</script>

<div>
  <Header />

  <section>
    <Configuration />
    <Playlists />

    <main class="card">
      <div class="stats">
        <Stats />
      </div>

      <div class="shuffle">
        <button on:click={shuffle} disabled={isShuffling}>
          <Refresh class={isShuffling ? 'spin' : ''} />
          {isShuffling ? `${Math.trunc((current / target) * 100)}%` : 'Shuffle'}
        </button>
      </div>
    </main>
  </section>
</div>

<style>
  section {
    text-align: left;
    display: grid;
    grid-template-columns: 400px 1fr;
    grid-template-areas: 'main main' 'config playlists';
    gap: 1rem;
    padding: 1rem;
  }

  @media (max-width: 1024px) {
    section {
      grid-template-columns: 1fr;
      grid-template-areas: 'main' 'playlists' 'config';
    }
  }

  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .shuffle {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .shuffle button {
    font-size: 1.5rem;
    width: 8em;
  }

  .stats {
    grid-area: main;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 1024px) {
    main {
      flex-direction: column;
      text-align: left;
      align-items: flex-start;
    }

    .stats {
      flex-direction: column;
      align-items: flex-start;
      margin: 0;
      padding: 0;
    }

    main button {
      margin-bottom: 1rem;
    }

    .shuffle {
      width: 100%;
    }
  }
</style>
