<script lang="ts">
  import login from '../functions/signInWithSpotify'
  import { token } from '../stores/token'

  $: if ($token) {
    window.location.href = '/app'
  }
</script>

<main>
  <div class="card">
    <button on:click={login}>Login with Spotify</button>
  </div>
</main>
