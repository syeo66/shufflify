<script lang="ts">
  import { run } from 'svelte/legacy';

  import { navigate } from 'svelte-routing'
  import { token } from '../stores/token'
  import UserInfo from './UserInfo.svelte'

  run(() => {
    if (!$token) {
      navigate('/')
    }
  });

  function logout() {
    token.set('')
  }
</script>

<header>
  <h1>Shufflify - Better shuffle for Spotify</h1>
  <div>
    <UserInfo />
    <button onclick={logout}>Logout</button>
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
    font-size: clamp(0.8rem, 3vw, 1.5rem);
    text-wrap: balance;
  }
</style>
