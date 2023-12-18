import './app.css'
import 'dracula-ui/styles/dracula-ui.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app') || document.createElement('div'),
})

export default app
