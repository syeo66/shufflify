<script lang="ts">
  import { playlists } from '../stores/playlists'
  import { configuration } from '../stores/configuration'
  import Refresh from './icons/Refresh.svelte'
</script>

<div class="paylists card">
  <div class="header">
    <h2>Playlists</h2>
    <button onclick={() => playlists.refetch()} disabled={$playlists.isLoading}
      ><Refresh class={$playlists.isLoading ? 'spin' : ''} /></button
    >
  </div>

  <ul>
    {#each $playlists.data?.sort((a, b) => a.name.trim().localeCompare(b.name.trim())) || [] as playlist}
      <li>
        <input
          bind:group={$configuration.checkedPlaylists}
          disabled={playlist.name.startsWith($configuration.randomListName)}
          type="checkbox"
          value={playlist.id}
        />{playlist.name}
        <div class="counts">{playlist.tracks.total}</div>
      </li>
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
      column-gap: 2rem;
    }
  }

  li {
    display: flex;
    text-wrap: balance;
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

  .counts {
    margin-left: auto;
    background-color: var(--color-secondary);
    padding: 0.1rem 0.7rem;
    border-radius: 2rem;
    font-size: 0.7rem;
  }
</style>
