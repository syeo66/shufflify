<script lang="ts">
  import { configuration } from '../stores/configuration'
</script>

<div class="config card">
  <div>
    <div class="field">
      <select bind:value={$configuration.amountType}>
        <option value="minutes">Minutes</option>
        <option value="trackcount">Track Count</option>
      </select>

      {#if $configuration.amountType === 'minutes'}
        <input type="text" bind:value={$configuration.trackMinutes} />
      {:else}
        <input type="text" bind:value={$configuration.trackCount} />
      {/if}
    </div>

    <div class="help">
      The playlist will be filled with
      {#if $configuration.amountType === 'minutes'}
        {Math.round(+$configuration.trackMinutes / 60 / 0.01) * 0.01} hours of music.
      {:else}
        {$configuration.trackCount} songs.
      {/if}
    </div>
  </div>

  <div>
    <div class="field">
      <label>
        <input type="checkbox" bind:checked={$configuration.syncFavorites} />
        Synchronize Favorites
      </label>
    </div>

    <div class="help">
      {#if $configuration.syncFavorites}
        Synchronize your favorite tracks for randomization.
      {:else}
        Do not synchronize your favorite tracks for randomization.
      {/if}
    </div>
  </div>

  <div>
    <div class="field">
      <label>
        Playlist Name
        <input type="text" bind:value={$configuration.randomListName} />
      </label>
    </div>

    <div class="help">
      The random playlist will be called «{$configuration.randomListName}»
    </div>
  </div>

  <div>
    <div class="field">
      <label>
        <input type="checkbox" bind:checked={$configuration.addDateToListName} />
        Add Date to Playlist Name
      </label>
    </div>

    <div class="help">
      {#if $configuration.addDateToListName}
        Add the current date to the playlist name.
      {:else}
        Do not add the current date to the playlist name.
      {/if}
    </div>
  </div>

  <div>
    <div class="field">
      <label>
        <input type="checkbox" bind:checked={$configuration.purgeOnShuffle} />
        Purge Playlist
      </label>
    </div>

    <div class="help">
      {#if $configuration.purgeOnShuffle}
        An existing playlist will be purged before adding new tracks.
      {:else}
        The tracks will be prepended if there is an existing playlist.
      {/if}
    </div>
  </div>
</div>

<style>
  .config {
    grid-area: config;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
