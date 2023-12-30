<script lang="ts">
  import { liveQuery } from 'dexie'
  import { stats } from '../stores/stats'
  import { db } from '../db'

  let syncedTrackCount = liveQuery(() => db.tracks.count())
  let uniqueTrackCount = liveQuery(() => db.tracks.orderBy('trackId').uniqueKeys())
</script>

<div>Last sync: 01.01.2022</div>
<div>Unique tracks: {new Set($uniqueTrackCount).size || 0}</div>
<div>Synced tracks: {$syncedTrackCount || 0}</div>
<div>Selected tracks: {$stats?.selectedTrackCount || 0}</div>
