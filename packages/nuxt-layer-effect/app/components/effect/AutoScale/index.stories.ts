import type { Meta, StoryObj } from '@storybook/vue3'
import EffectAutoScale from './index.vue'

const aligns = [ 'left', 'center', 'right' ] as const
const verticalAligns = [ 'top', 'center', 'bottom' ] as const

const meta = {
  title: 'Effect/AutoScale',
  component: EffectAutoScale,
  argTypes: {
    align: { control: 'select', options: aligns },
    verticalAlign: { control: 'select', options: verticalAligns },
    allowZoomIn: { control: 'boolean' },
  },
  args: {
    align: 'center',
    verticalAlign: 'center',
    allowZoomIn: false,
  },
  render: args => ({
    components: { EffectAutoScale },
    setup: () => ({ args }),
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-500">Drag the corner ↘ to resize the container — content rescales to fit</p>
        <div
          class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100"
          style="resize: both; width: 320px; height: 120px; min-width: 80px; min-height: 40px; max-width: 720px; max-height: 360px;"
        >
          <EffectAutoScale v-bind="args" class="size-full">
            <div class="text-4xl font-bold">Auto Scaled Text</div>
          </EffectAutoScale>
        </div>
      </div>
    `,
  }),
} satisfies Meta<typeof EffectAutoScale>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Aligns: Story = {
  parameters: noControls,
  render: () => ({
    components: { EffectAutoScale },
    setup: () => ({ aligns }),
    template: `
      <div class="flex flex-wrap gap-4">
        <div v-for="a in aligns" :key="a" class="space-y-1">
          <div class="text-xs text-gray-500">align: {{ a }}</div>
          <div class="overflow-hidden rounded border border-dashed border-gray-300 bg-gray-100" style="width: 220px; height: 80px;">
            <EffectAutoScale :align="a" class="size-full">
              <div class="text-base">Sample</div>
            </EffectAutoScale>
          </div>
        </div>
      </div>
    `,
  }),
}

export const VerticalAligns: Story = {
  parameters: noControls,
  render: () => ({
    components: { EffectAutoScale },
    setup: () => ({ verticalAligns }),
    template: `
      <div class="flex flex-wrap gap-4">
        <div v-for="v in verticalAligns" :key="v" class="space-y-1">
          <div class="text-xs text-gray-500">verticalAlign: {{ v }}</div>
          <div class="overflow-hidden rounded border border-dashed border-gray-300 bg-gray-100" style="width: 200px; height: 100px;">
            <EffectAutoScale :vertical-align="v" class="size-full">
              <div class="text-3xl font-bold">Wide Sample Text</div>
            </EffectAutoScale>
          </div>
        </div>
      </div>
    `,
  }),
}

export const AllowZoomIn: Story = {
  parameters: noControls,
  render: () => ({
    components: { EffectAutoScale },
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-500">Drag the corners ↘ to compare — content fits naturally inside both containers</p>
        <div class="flex flex-wrap gap-4">
          <div class="space-y-1">
            <div class="text-xs text-gray-500">allowZoomIn: false (default — only shrinks)</div>
            <div
              class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100"
              style="resize: both; width: 280px; height: 100px; min-width: 80px; min-height: 40px; max-width: 600px; max-height: 300px;"
            >
              <EffectAutoScale class="size-full">
                <div class="text-sm">Small text stays small</div>
              </EffectAutoScale>
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-xs text-gray-500">allowZoomIn: true (also enlarges)</div>
            <div
              class="overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100"
              style="resize: both; width: 280px; height: 100px; min-width: 80px; min-height: 40px; max-width: 600px; max-height: 300px;"
            >
              <EffectAutoScale allow-zoom-in class="size-full">
                <div class="text-sm">Small text scales up</div>
              </EffectAutoScale>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
