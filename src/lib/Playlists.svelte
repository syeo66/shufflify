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
      <li><input type="checkbox" />{playlist.name}</li>
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

  .card {
    max-width: 100%;
    container-type: inline-size;
  }

  ul {
    list-style: none;
    padding: 0;
    max-width: 100%;
  }

  @container (min-width: 768px) {
    ul {
      columns: 2;
    }
  }

  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  li:last-child {
    margin-bottom: 0;
  }

  li > * {
    flex-shrink: 0;
  }
</style>
