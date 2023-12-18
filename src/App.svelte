<script lang="ts">
  import { Router, Route } from "svelte-routing";

  import Main from "./lib/Main.svelte";
  import Login from "./lib/Login.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/" component={Login} />
  <Route path="/app" component={Main} />
</Router>

<style></style>
