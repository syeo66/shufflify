<script lang="ts">
  import { liveQuery } from 'dexie'
  import { stats } from '../stores/stats'
  import { db } from '../db'

  let syncedTrackCount = liveQuery(() => db.tracks.count())
  let uniqueTrackCount = liveQuery(() => db.tracks.orderBy('trackId').uniqueKeys())
  let lastUpdated = liveQuery(() => db.tracks.orderBy('timestamp').last())
</script>

<div>Last sync: {$lastUpdated?.timestamp ? new Date($lastUpdated.timestamp).toLocaleString() : 'never'}</div>
<div>Unique tracks: {new Set($uniqueTrackCount).size || 0}</div>
<div>Synced tracks: {$syncedTrackCount || 0}</div>
<div>Selected tracks: {$stats?.selectedTrackCount || 0}</div>
