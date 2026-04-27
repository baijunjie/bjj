# nuxt-layer-effect

A Nuxt Layer providing UI-agnostic effect components built on top of native browser APIs (`ResizeObserver`, `MutationObserver`, `IntersectionObserver`). The layer has **no third-party UI library dependencies** — components are styled with inline CSS only and ship without Tailwind.

## Storybook Preview

Live docs: **<https://baijunjie.github.io/bjj/nuxt-layer-effect/storybook/>**

## Installation

```bash
pnpm add @bjj/nuxt-layer-effect
```

Peer dependencies (install these in the host project):

```
nuxt vue
```

## Usage

Extend the layer from the host project's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [ '@bjj/nuxt-layer-effect' ],
})
```

The layer automatically registers all components under `app/components/**` (with directory-based prefix, so files become `<EffectAutoScale>` etc.).

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
pnpm release:bjj        # Publish @bjj/nuxt-layer-effect only
pnpm release:polymarbot # Publish @polymarbot/nuxt-layer-effect only
pnpm release:elepay     # Publish @elepay-io/nuxt-layer-effect only
```