<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import retrieveUserData from "../queries/retrieveUserData";

  const query = createQuery({
    queryKey: ["userInfo"],
    queryFn: retrieveUserData,
  });
</script>

<div class="card">
  {#if $query.isPending}
    Loading...
  {/if}
  {#if $query.error}
    An error has occurred:
    {$query.error.message}
  {/if}
  {#if $query.isSuccess}
    <pre>{JSON.stringify($query.data, null, 2)}</pre>
  {/if}
</div>
