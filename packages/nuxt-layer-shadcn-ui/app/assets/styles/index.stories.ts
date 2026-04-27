import type { Meta, StoryObj } from '@storybook/vue3'

type Swatch = {
  name: string
  token: string
  bg: string
  fg?: string
  border?: boolean
  span?: string
}

type Group = {
  title: string
  description?: string
  swatches: Swatch[]
  cols?: string
}

const groups: Group[] = [
  {
    title: 'Surface',
    description: 'Two independent axes — elevation (background / card / popover) and interaction (muted / accent).',
    cols: 'grid-cols-1 sm:grid-cols-2',
    swatches: [
      { name: 'background', token: '--color-background', bg: 'bg-background', fg: 'text-foreground', border: true, span: 'col-span-2' },
      { name: 'card', token: '--color-card', bg: 'bg-card', fg: 'text-card-foreground', border: true },
      { name: 'popover', token: '--color-popover', bg: 'bg-popover', fg: 'text-popover-foreground', border: true },
      { name: 'muted', token: '--color-muted', bg: 'bg-muted', fg: 'text-muted-foreground' },
      { name: 'accent', token: '--color-accent', bg: 'bg-accent', fg: 'text-accent-foreground' },
    ],
  },
  {
    title: 'Brand',
    description: 'Primary and secondary colors for buttons, links and emphasis.',
    swatches: [
      { name: 'primary', token: '--color-primary', bg: 'bg-primary', fg: 'text-primary-foreground' },
      { name: 'secondary', token: '--color-secondary', bg: 'bg-secondary', fg: 'text-secondary-foreground' },
    ],
  },
  {
    title: 'Status',
    description: 'Semantic feedback colors for success, info, warn, danger, etc.',
    swatches: [
      { name: 'success', token: '--color-success', bg: 'bg-success', fg: 'text-success-foreground' },
      { name: 'info', token: '--color-info', bg: 'bg-info', fg: 'text-info-foreground' },
      { name: 'help', token: '--color-help', bg: 'bg-help', fg: 'text-help-foreground' },
      { name: 'warn', token: '--color-warn', bg: 'bg-warn', fg: 'text-warn-foreground' },
      { name: 'danger', token: '--color-danger', bg: 'bg-danger', fg: 'text-danger-foreground' },
    ],
  },
  {
    title: 'Sidebar',
    description: 'Dedicated sidebar palette so the nav can visually separate from main content.',
    swatches: [
      { name: 'sidebar', token: '--color-sidebar', bg: 'bg-sidebar', fg: 'text-sidebar-foreground', border: true },
      { name: 'sidebar-primary', token: '--color-sidebar-primary', bg: 'bg-sidebar-primary', fg: 'text-sidebar-primary-foreground' },
      { name: 'sidebar-accent', token: '--color-sidebar-accent', bg: 'bg-sidebar-accent', fg: 'text-sidebar-accent-foreground' },
    ],
  },
]

const borders = [
  { name: 'border', token: '--color-border', class: 'border-border' },
  { name: 'input', token: '--color-input', class: 'border-input' },
  { name: 'ring', token: '--color-ring', class: 'border-ring' },
]

const foregrounds = [
  { name: 'foreground', token: '--foreground', class: 'text-foreground' },
  { name: 'foreground-muted', token: '--foreground-muted', class: 'text-muted-foreground' },
  { name: 'foreground-accent', token: '--foreground-accent', class: 'text-accent-foreground' },
]

const meta = {
  title: 'Theme/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Design tokens from the shadcn-vue Zinc palette, registered via Tailwind v4 `@theme`. Toggle the Storybook backgrounds to preview Light and Dark modes.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {
  render: () => ({
    setup: () => ({ groups, borders, foregrounds }),
    template: `
      <div class="space-y-10">
        <section v-for="group in groups" :key="group.title">
          <header class="mb-4">
            <h3 class="text-lg font-medium">{{ group.title }}</h3>
            <p v-if="group.description" class="mt-1 text-sm text-muted-foreground">{{ group.description }}</p>
          </header>
          <div :class="['grid gap-3', group.cols || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4']">
            <div
              v-for="swatch in group.swatches"
              :key="swatch.name"
              :class="[
                'flex h-24 flex-col justify-between rounded-md p-3 shadow-sm',
                swatch.bg,
                swatch.fg,
                swatch.border ? 'border border-border' : '',
                swatch.span,
              ]"
            >
              <span class="font-mono text-xs font-medium">{{ swatch.name }}</span>
              <div class="flex items-end justify-between">
                <span class="font-mono text-[10px] opacity-70">{{ swatch.token }}</span>
                <span class="text-lg font-semibold">Aa</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <header class="mb-4">
            <h3 class="text-lg font-medium">Foreground</h3>
            <p class="mt-1 text-sm text-muted-foreground">Three-level contrast hierarchy for body text.</p>
          </header>
          <div class="space-y-2 rounded-md border border-border bg-background p-4">
            <p v-for="fg in foregrounds" :key="fg.name" :class="fg.class">
              <span class="font-mono text-xs mr-2">{{ fg.class }}</span>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </section>

        <section>
          <header class="mb-4">
            <h3 class="text-lg font-medium">Border & Ring</h3>
            <p class="mt-1 text-sm text-muted-foreground">Dividers, input borders and focus ring highlights.</p>
          </header>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="b in borders"
              :key="b.name"
              :class="['rounded-md border-2 px-5 py-6 bg-background', b.class]"
            >
              <div class="font-mono text-xs font-medium">{{ b.name }}</div>
              <div class="font-mono text-[10px] text-muted-foreground">{{ b.token }}</div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}

export const LightVsDark: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of Light and Dark palettes, independent of the top-level background toggle.',
      },
    },
  },
  render: () => ({
    setup: () => ({ groups: groups.filter(g => g.title !== 'Sidebar') }),
    template: `
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-lg border border-border bg-background p-6">
          <div class="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">Light</div>
          <div class="space-y-6">
            <div v-for="group in groups" :key="group.title">
              <div class="mb-2 text-sm font-medium">{{ group.title }}</div>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="swatch in group.swatches"
                  :key="swatch.name"
                  :class="[
                    'flex h-14 items-center justify-center rounded border',
                    swatch.bg,
                    swatch.fg || 'text-foreground',
                    swatch.border ? 'border-border' : 'border-transparent',
                    swatch.span,
                  ]"
                >
                  <span class="font-mono text-xs">{{ swatch.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dark rounded-lg border border-border bg-background p-6 text-foreground">
          <div class="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">Dark</div>
          <div class="space-y-6">
            <div v-for="group in groups" :key="group.title">
              <div class="mb-2 text-sm font-medium">{{ group.title }}</div>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="swatch in group.swatches"
                  :key="swatch.name"
                  :class="[
                    'flex h-14 items-center justify-center rounded border',
                    swatch.bg,
                    swatch.fg || 'text-foreground',
                    swatch.border ? 'border-border' : 'border-transparent',
                    swatch.span,
                  ]"
                >
                  <span class="font-mono text-xs">{{ swatch.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
