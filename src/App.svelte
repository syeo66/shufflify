<script lang="ts">
  import { Router, Route } from "svelte-routing";

  import Main from "./lib/Main.svelte";
  import Login from "./lib/Login.svelte";
  import { token } from "./stores/token";

  export let url = "";

  for (const entry of window.location.hash.substring(1).split("&")) {
    const splitEntry = entry.split("=");
    if (splitEntry[0] === "access_token") {
      token.set(splitEntry[1]);
    }
  }
</script>

<Router {url}>
  <Route path="/" component={Login} />
  <Route path="/app" component={Main} />
</Router>

<footer>
  This website is communicating with the Spotify API only. It never sends or
  stores any data to its own server.
</footer>

<style>
  footer {
    text-align: center;
    margin-top: 2rem;
  }
</style>
