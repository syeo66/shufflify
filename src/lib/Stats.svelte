<script lang="ts">
  import { configuration } from '../stores/configuration'
  import { availableDevice } from '../stores/availableDevice'
  import { stats } from '../stores/stats'
</script>

<div class="stats">
  <div>Selected tracks: {$stats?.selectedTrackCount || 0}</div>
  {#if $configuration.addToQueue && $availableDevice}
    <div>Add to queue of device "{$availableDevice}"</div>
  {/if}
</div>

<style>
  .stats {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
</style>
