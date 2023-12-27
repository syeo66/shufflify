<script lang="ts">
  import { navigate } from 'svelte-routing'

  import { token } from '../stores/token'

  import Configuration from './Configuration.svelte'
  import Header from './Header.svelte'
  import Playlists from './Playlists.svelte'

  $: if (!$token) {
    window.location.href = '/'
  }
</script>

<div>
  <Header />

  <section>
    <Configuration />
    <Playlists />
    <main>Create random playlists for your Spotify library.</main>
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
  }
</style>
