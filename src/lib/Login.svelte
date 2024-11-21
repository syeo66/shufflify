<script lang="ts">
  import { run } from 'svelte/legacy';

  import login from '../functions/signInWithSpotify'
  import { token } from '../stores/token'

  run(() => {
    if ($token) {
      window.location.href = '/app'
    }
  });
</script>

<main>
  <div class="card">
    <button onclick={login}>Login with Spotify</button>
  </div>
</main>

<style>
  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem;
    box-sizing: border-box;
    width: calc(100% - 4rem);
  }

  main {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin: 0;
  }
</style>
