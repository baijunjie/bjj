import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import ButtonGroup from './index.vue'

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ButtonGroup, Button, Input, Icon },
    setup () {
      const search = ref('')
      return { search }
    },
    template: `
      <div class="space-y-10">
        <!-- Button Group -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Buttons</h3>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </section>

        <!-- With Icons -->
        <section>
          <h3 class="mb-4 text-lg font-medium">With Icons</h3>
          <ButtonGroup>
            <Button variant="outline" size="icon"><Icon name="bold" /></Button>
            <Button variant="outline" size="icon"><Icon name="italic" /></Button>
            <Button variant="outline" size="icon"><Icon name="underline" /></Button>
            <Button variant="outline" size="icon"><Icon name="strikethrough" /></Button>
          </ButtonGroup>
        </section>

        <!-- Input + Button -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Input + Button</h3>
          <ButtonGroup>
            <Input v-model="search" placeholder="Search..." />
            <Button variant="outline"><Icon name="search" /></Button>
          </ButtonGroup>
        </section>

        <!-- Button + Input + Button -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Button + Input + Button</h3>
          <ButtonGroup>
            <Button variant="outline" size="icon"><Icon name="minus" /></Button>
            <Input class="w-20 text-center" model-value="5" />
            <Button variant="outline" size="icon"><Icon name="plus" /></Button>
          </ButtonGroup>
        </section>

        <!-- Mixed Variants -->
        <section>
          <h3 class="mb-4 text-lg font-medium">Mixed Variants</h3>
          <ButtonGroup>
            <Button variant="outline">Save</Button>
            <Button>Submit</Button>
          </ButtonGroup>
        </section>
      </div>
    `,
  }),
}
