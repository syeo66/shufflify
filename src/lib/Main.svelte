<script lang="ts">
  import { liveQuery } from 'dexie'

  import { configuration } from '../stores/configuration'
  import { db } from '../db'
  import { playlistSchema, type Playlist } from '../types'
  import { playlists } from '../stores/playlists'
  import { stats } from '../stores/stats'
  import { token } from '../stores/token'
  import { trackSync } from '../stores/trackSync'

  import Configuration from './Configuration.svelte'
  import Header from './Header.svelte'
  import Playlists from './Playlists.svelte'
  import Stats from './Stats.svelte'
  import Refresh from './icons/Refresh.svelte'

  let lastUpdated = liveQuery(() => db.tracks.orderBy('timestamp').last())

  let isShuffling = false

  $: if (!$token) {
    window.location.href = '/'
  }

  $: console.log($configuration)
  $: console.log($playlists)

  async function addRandomTracks(playlist: Playlist, trackUris: string[]) {
    const playlistId = playlist.id
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${$token}`,
      },
      body: JSON.stringify({
        uris: trackUris,
        position: 0,
      }),
    })
  }

  async function createRandomPlaylist(): Promise<Playlist> {
    const url = 'https://api.spotify.com/v1/me/playlists'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${$token}`,
      },
      body: JSON.stringify({
        name: $configuration.randomListName,
        description: 'Shufflify Playlist',
        public: false,
      }),
    })

    const data = await response.json()
    await playlists.refetch()
    return playlistSchema.parse(data)
  }

  async function fillRandomPlaylist(playlist: Playlist) {}

  async function shuffle() {
    isShuffling = true
    await playlists.refetch()

    let existingPlaylist = $playlists.data?.find((playlist) => playlist.name === $configuration.randomListName) ?? null

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

    console.log(existingPlaylist)

    isShuffling = false
  }
</script>

<div>
  {#if $trackSync.isLoading}
    <progress class="progress" value={$trackSync.progress} max={$trackSync.total} />
  {/if}

  <Header />

  <section>
    <Configuration />
    <Playlists />

    <main class="card">
      <div class="stats">
        <button on:click={() => trackSync.start($stats.selectedPlaylists)} disabled={!!$trackSync.isLoading}>
          <Refresh class={$trackSync.isLoading ? 'spin' : ''} />
          Synchronize Tracks</button
        >
        <Stats />
      </div>

      {#if $lastUpdated?.timestamp && !$trackSync.isLoading}
        <div class="shuffle">
          <button on:click={shuffle} disabled={isShuffling}>
            <Refresh class={isShuffling ? 'spin' : ''} />
            Shuffle
          </button>
        </div>
      {/if}
    </main>
  </section>
</div>

<style>
  .progress {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
  }

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

    main button {
      align-self: center;
      margin-bottom: 1rem;
    }
  }
</style>
