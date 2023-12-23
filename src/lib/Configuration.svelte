<script lang="ts">
  import { configuration } from '../stores/configuration'
</script>

<div class="config card">
  <div class="field">
    {#if $configuration.amountType === 'minutes'}
      <input type="text" bind:value={$configuration.trackMinutes} />
    {:else}
      <input type="text" bind:value={$configuration.trackCount} />
    {/if}

    <select bind:value={$configuration.amountType}>
      <option value="minutes">Minutes</option>
      <option value="trackcount">Track Count</option>
    </select>
  </div>

  <div class="field">
    <label>
      Playlist Name
      <input type="text" bind:value={$configuration.randomListName} />
    </label>
  </div>

  <div class="field">
    <label>
      <input type="checkbox" bind:checked={$configuration.purgeOnShuffel} />
      Purge Playlist
    </label>
  </div>
</div>

<style>
  .config {
    grid-area: config;
  }
</style>
