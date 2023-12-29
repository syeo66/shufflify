<script lang="ts">
  import { token } from '../stores/token'
  import { trackSync } from '../stores/trackSync'
  import { stats } from '../stores/stats'

  import Configuration from './Configuration.svelte'
  import Header from './Header.svelte'
  import Playlists from './Playlists.svelte'
  import Stats from './Stats.svelte'

  import Refresh from './icons/Refresh.svelte'

  $: if (!$token) {
    window.location.href = '/'
  }
</script>

<div>
  <Header />

  <section>
    <Configuration />
    <Playlists />
    <main class="card">
      <button on:click={() => trackSync.start($stats.selectedPlaylists)} disabled={!!$trackSync.isLoading}>
        <Refresh class={$trackSync.isLoading ? 'spin' : ''} />
        Synchronize Tracks</button
      >
      <Stats />
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
    justify-content: space-between;
    align-items: center;
  }
</style>
