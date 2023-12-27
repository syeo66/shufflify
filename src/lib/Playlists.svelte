<script lang="ts">
  import { playlists } from '../stores/playlists'
  import Refresh from './icons/Refresh.svelte'
</script>

<div class="paylists card">
  <div class="header">
    <h2>Playlists</h2>
    <button on:click={() => playlists.refetch()} disabled={$playlists.isLoading}
      ><Refresh class={$playlists.isLoading ? 'spin' : ''} /></button
    >
  </div>

  <ul>
    {#each $playlists.data?.sort((a, b) => a.name
        .trim()
        .localeCompare(b.name.trim())) || [] as playlist}
      <li>{playlist.name}</li>
    {/each}
  </ul>
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .header h2 {
    margin: 0;
  }
</style>
