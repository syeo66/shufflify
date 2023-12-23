<script lang="ts">
  import { navigate } from "svelte-routing";
  import { token } from "../stores/token";
  import Header from "./Header.svelte";
  import Configuration from "./Configuration.svelte";

  $: if (!$token) {
    navigate("/");
  }
</script>

<div>
  <Header />

  <section>
    <Configuration />
    <main>Create random playlists for your Spotify library.</main>
  </section>
</div>

<style>
  section {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "config main";
    gap: 1rem;
  }

  main {
    grid-area: main;
  }
</style>
