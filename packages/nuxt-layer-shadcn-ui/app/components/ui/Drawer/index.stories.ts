import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import Drawer from './index.vue'

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    confirmDisabled: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    showClose: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    hideFooter: { control: 'boolean' },
    side: {
      control: 'select',
      options: [ 'top', 'right', 'bottom', 'left' ],
    },
  },
  args: {
    loading: false,
    disabled: false,
    confirmDisabled: false,
    showCancel: false,
    showClose: true,
    hideHeader: false,
    hideFooter: false,
    side: 'right',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Drawer, Button, Input },
    setup () {
      const controlled = ref(false)
      const withDescription = ref(false)
      const sideTop = ref(false)
      const sideRight = ref(false)
      const sideBottom = ref(false)
      const sideLeft = ref(false)
      const scrollable = ref(false)
      return { args, controlled, withDescription, sideTop, sideRight, sideBottom, sideLeft, scrollable }
    },
    template: `
      <div class="space-y-10">
        <!-- Controlled -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Controlled</h3>
          <Button @click="controlled = true">Open Drawer</Button>
          <Drawer
            v-model:visible="controlled"
            v-bind="args"
            title="Drawer Title"
            confirmText="OK"
            cancelText="Cancel"
          >
            <p>This is the drawer content.</p>
            <Input class="mt-4" placeholder="Try interacting with this input" />
          </Drawer>
        </section>

        <!-- With Description -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Description</h3>
          <Button @click="withDescription = true">Open Drawer</Button>
          <Drawer
            v-model:visible="withDescription"
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
        </section>

        <!-- Scrollable Content -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Scrollable Content</h3>
          <Button @click="scrollable = true">Open Drawer</Button>
          <Drawer v-model:visible="scrollable" title="Terms of Service" showCancel confirmText="Accept">
            <div class="space-y-4">
              <p v-for="i in 20" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
          </Drawer>
        </section>

        <!-- Side Variants -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Side</h3>
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
        </section>
      </div>
    `,
  }),
}
