import '@fontsource/ibm-plex-mono/500.css'
import './app.css'
import App from './App.svelte'
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById('app') ?? document.createElement('div'),
})

export default app
