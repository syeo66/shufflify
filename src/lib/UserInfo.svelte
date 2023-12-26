<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { navigate } from 'svelte-routing'

  import { token } from '../stores/token'
  import retrieveUserData from '../queries/retrieveUserData'

  const query = createQuery({
    queryKey: ['userInfo'],
    queryFn: retrieveUserData,
  })

  $: if ($query.error) {
    console.log($query.error)
    token.set('')
    navigate('/')
  }
</script>

{#if $query.isPending}...{/if}
{#if $query.isSuccess}
  <img
    src={$query.data.images.find(({ width }) => width <= 64)?.url}
    alt="Avatar of {$query.data.display_name}"
    title={$query.data.display_name}
  />
{/if}

<style>
  img {
    width: 42px;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
</style>
