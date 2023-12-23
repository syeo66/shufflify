<script lang="ts">
  import { navigate } from 'svelte-routing'
  import { token } from '../stores/token'
  import UserInfo from './UserInfo.svelte'

  $: if (!$token) {
    navigate('/')
  }

  function logout() {
    token.set('')
  }
</script>

<header>
  <h1>Shufflify - Better shuffle for Spotify</h1>
  <div>
    <UserInfo />
    <button on:click={logout}>Logout</button>
  </div>
</header>

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

  header div {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
</style>
