<script lang="ts">
  import { stats } from '../stores/stats'
</script>

<div>Selected tracks: {$stats?.selectedTrackCount || 0}</div>
