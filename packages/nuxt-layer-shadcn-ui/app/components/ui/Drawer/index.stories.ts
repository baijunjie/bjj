import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import type { DrawerSide } from './types'
import Drawer from './index.vue'

const sides: DrawerSide[] = [ 'top', 'right', 'bottom', 'left' ]

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    confirmDisabled: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    showClose: { control: 'boolean' },
    closeOnClickOutside: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    hideFooter: { control: 'boolean' },
    side: { control: 'select', options: sides },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
  },
  args: {
    loading: false,
    disabled: false,
    confirmDisabled: false,
    showCancel: true,
    showClose: true,
    closeOnClickOutside: false,
    hideHeader: false,
    hideFooter: false,
    side: 'right',
    title: 'Drawer Title',
    description: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
  },
  render: args => ({
    components: { Drawer, Button, Input },
    setup () {
      const visible = ref(false)
      return { args, visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Drawer</Button>
        <Drawer v-model:visible="visible" v-bind="args">
          <p>This is the drawer content.</p>
          <Input class="mt-4" placeholder="Try interacting with this input" />
        </Drawer>
      </div>
    `,
  }),
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithDescription: Story = {
  parameters: noControls,
  render: () => ({
    components: { Drawer, Button, Input },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Drawer</Button>
        <Drawer
          v-model:visible="visible"
          title="Edit Profile"
          description="Update your personal information. Changes will be visible to other users immediately."
          showCancel
          confirmText="Save"
        >
          <div class="space-y-3">
            <Input placeholder="Name" />
            <Input placeholder="Email" />
          </div>
        </Drawer>
      </div>
    `,
  }),
}

export const ScrollableContent: Story = {
  parameters: noControls,
  render: () => ({
    components: { Drawer, Button },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Drawer</Button>
        <Drawer v-model:visible="visible" title="Terms of Service" showCancel confirmText="Accept">
          <div class="space-y-4">
            <p v-for="i in 20" :key="i">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </Drawer>
      </div>
    `,
  }),
}

export const Sides: Story = {
  parameters: noControls,
  render: () => ({
    components: { Drawer, Button },
    setup () {
      const sideTop = ref(false)
      const sideRight = ref(false)
      const sideBottom = ref(false)
      const sideLeft = ref(false)
      return { sideTop, sideRight, sideBottom, sideLeft }
    },
    template: `
      <div>
        <div class="flex gap-2">
          <Button variant="outline" @click="sideTop = true">Top</Button>
          <Button variant="outline" @click="sideRight = true">Right</Button>
          <Button variant="outline" @click="sideBottom = true">Bottom</Button>
          <Button variant="outline" @click="sideLeft = true">Left</Button>
        </div>
        <Drawer v-model:visible="sideTop" side="top" title="Top Drawer">
          <p>Slides in from the top.</p>
        </Drawer>
        <Drawer v-model:visible="sideRight" side="right" title="Right Drawer">
          <p>Slides in from the right.</p>
        </Drawer>
        <Drawer v-model:visible="sideBottom" side="bottom" title="Bottom Drawer">
          <p>Slides in from the bottom.</p>
        </Drawer>
        <Drawer v-model:visible="sideLeft" side="left" title="Left Drawer">
          <p>Slides in from the left.</p>
        </Drawer>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { Drawer, Button },
    setup () {
      const visible = ref(false)
      return { visible }
    },
    template: `
      <div>
        <Button @click="visible = true">Open Drawer</Button>
        <Drawer
          v-model:visible="visible"
          title="Event Demo"
          description="Open the Actions panel to see emitted events."
          showCancel
          confirmText="Confirm"
          @open="() => {}"
          @close="() => {}"
          @closed="() => {}"
          @confirm="() => {}"
          @cancel="() => {}"
        >
          <p>Click Confirm, Cancel, or the close button to see events fire.</p>
        </Drawer>
      </div>
    `,
  }),
}
