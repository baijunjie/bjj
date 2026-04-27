import { join } from 'node:path'

// Use full resolved paths for layer (~ resolves to consuming app, not layer)
const currentDir = import.meta.dirname

export default defineNuxtConfig({
  components: [
    { path: join(currentDir, 'app/components'), pathPrefix: true, extensions: [ 'vue' ]},
  ],
})
