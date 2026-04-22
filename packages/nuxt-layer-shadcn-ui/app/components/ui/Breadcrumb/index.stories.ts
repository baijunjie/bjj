import type { Meta, StoryObj } from '@storybook/vue3'
import Breadcrumb from './index.vue'

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Breadcrumb },
    setup () {
      const home = { label: 'Home', icon: 'house', href: '/' }
      const basicItems = [
        { label: 'Products', href: '/products' },
        { label: 'Electronics', href: '/products/electronics' },
        { label: 'Laptops' },
      ]
      const withIcons = [
        { label: 'Settings', icon: 'settings', href: '/settings' },
        { label: 'Profile' },
      ]
      return { home, basicItems, withIcons }
    },
    template: `
      <div class="space-y-10">
        <section>
          <h3 class="mb-4 text-lg font-medium">Basic</h3>
          <Breadcrumb :model="basicItems" />
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Home</h3>
          <Breadcrumb :home="home" :model="basicItems" />
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">With Icons</h3>
          <Breadcrumb :home="home" :model="withIcons" />
        </section>

        <section>
          <h3 class="mb-4 text-lg font-medium">Single Item</h3>
          <Breadcrumb :home="home" />
        </section>
      </div>
    `,
  }),
}
