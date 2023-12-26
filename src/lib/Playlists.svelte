<script lang="ts">
  import { playlists } from '../stores/playlists'
</script>

<div class="paylists card">
  <h2>Playlists</h2>

  <ul>
    {#each $playlists?.sort((a, b) => a.name
        .trim()
        .localeCompare(b.name.trim())) || [] as playlist}
      <li>{playlist.name}</li>
    {/each}
  </ul>

  <pre>{JSON.stringify($playlists, null, 2)}</pre>
</div>
