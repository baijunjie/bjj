# nuxt-layer-shadcn-ui

A Nuxt Layer built on [shadcn-vue](https://www.shadcn-vue.com/), providing a ready-to-use set of UI components, composables, and utilities.

## Storybook Preview

Live docs: **<https://baijunjie.github.io/bjj/nuxt-layer-shadcn-ui/storybook/>**

## Installation

```bash
pnpm add @bjj/nuxt-layer-shadcn-ui
```

Peer dependencies (install these in the host project):

```
@bjj/shared @nuxtjs/i18n @vueuse/core dayjs nuxt vue vue-i18n vue-router
```

## Usage

Extend the layer from the host project's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [ '@bjj/nuxt-layer-shadcn-ui' ],
})
```

The layer automatically registers:

- All components under `app/components/ui/**` (no prefix, usable as global components)
- Business components under `app/components/**` (with directory-based prefix)
- Auto-imports from `app/composables`, `app/utils`, and `app/types`
- The global stylesheet `app/assets/styles/globals.css` (Tailwind v4)
- `@nuxtjs/i18n` module along with this layer's `i18n.config.ts`

## Local Development

```bash
# Start Storybook (default port 6006)
pnpm storybook

# Build the Storybook static site
pnpm storybook:build

# Add a new shadcn-vue component
pnpm shadcn:add <component>

# Type check
pnpm typecheck
```

## Publishing

```bash
pnpm release            # Publish to all registries
pnpm release:bjj        # Publish @bjj/nuxt-layer-shadcn-ui only
pnpm release:polymarbot # Publish @polymarbot/nuxt-layer-shadcn-ui only
pnpm release:elepay     # Publish @elepay-io/nuxt-layer-shadcn-ui only
```