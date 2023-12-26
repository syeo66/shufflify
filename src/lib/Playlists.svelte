<script lang="ts">
  import retrievePlaylists from '../queries/retrievePlaylists'
  import { createQueries } from '@tanstack/svelte-query'

  const queries = createQueries({
    queries: [
      {
        queryKey: ['playlists'],
        queryFn: () => retrievePlaylists(),
      },
    ],
  })
</script>

<div class="paylists card">
  {#each $queries as query}
    {#if query.isPending}...{/if}

    {#if query.error}
      Error:
      <pre>{JSON.stringify(query.error, null, 2)}</pre>
    {/if}

    {#if query.isSuccess}
      <h2>Playlists</h2>

      {#if query.data}
        <ul>
          {#each query.data.items.sort((a, b) => a.name
              .trim()
              .localeCompare(b.name.trim())) as playlist}
            <li>{playlist.name}</li>
          {/each}
        </ul>
      {/if}

      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    {/if}
  {/each}
</div>
