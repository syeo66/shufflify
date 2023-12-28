<script lang="ts">
  import { stats } from '../stores/stats'
</script>

<div>Last sync: 01.01.2022</div>
<div>Unique tracks: 0</div>
<div>Synced tracks: 0</div>
<div>Selected tracks: {$stats?.selectedTrackCount || 0}</div>
