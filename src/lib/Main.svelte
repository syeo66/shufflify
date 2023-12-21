<script lang="ts">
  import { navigate } from "svelte-routing";
  import { token } from "../stores/token";

  $: if (!$token) {
    navigate("/");
  }

  const logout = () => {
    token.set("");
  };
</script>

<div>
  <header>
    <h1>Shufflify - Better shuffle for Spotify</h1>
    <button on:click={logout}>Logout</button>
  </header>
  <main>Create random playlists for your Spotify library.</main>
</div>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    width: 100%;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    box-sizing: border-box;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
</style>
