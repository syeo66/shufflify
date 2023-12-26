<script lang="ts">
  import retrievePlaylists from '../queries/retrievePlaylists'
  import { createQuery } from '@tanstack/svelte-query'

  const query = createQuery({
    queryKey: ['playlists'],
    queryFn: () => retrievePlaylists(),
  })
</script>

<div class="paylists card">
  {#if $query.isPending}...{/if}
  {#if $query.error}
    <pre>{JSON.stringify($query.error, null, 2)}</pre>
  {/if}
  {#if $query.isSuccess}
    <pre>{JSON.stringify($query.data, null, 2)}</pre>
  {/if}
</div>
