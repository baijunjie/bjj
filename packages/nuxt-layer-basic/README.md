# nuxt-layer-basic

A Nuxt layer that bundles shared client/server utilities and UI-agnostic components for use across Nuxt projects.

## Storybook Preview

Live docs: **<https://baijunjie.github.io/bjj/nuxt-layer-basic/storybook/>**

## Installation

```bash
pnpm add @bjj/nuxt-layer-basic
```

Peer dependencies (install these in the host project):

```
nuxt vue
```

## Usage

Extend the layer from the host project's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [ '@bjj/nuxt-layer-basic' ],
})
```

The layer auto-registers:

- Components under `app/components/**` (directory-based prefix)
- App utilities under `app/utils/**` (auto-imported on the client)
- Server utilities under `server/utils/**` (auto-imported in Nitro)

## Local Development

```bash
# Start Storybook (default port 6007)
pnpm storybook

# Build the Storybook static site
pnpm storybook:build

# Type check
pnpm typecheck
```

## Publishing

```bash
pnpm release            # Publish to all registries
pnpm release:bjj        # Publish @bjj/nuxt-layer-basic only
pnpm release:polymarbot # Publish @polymarbot/nuxt-layer-basic only
pnpm release:elepay     # Publish @elepay-io/nuxt-layer-basic only
```