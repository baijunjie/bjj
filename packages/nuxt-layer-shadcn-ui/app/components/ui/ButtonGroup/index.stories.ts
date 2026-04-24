import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from '../Icon/index.vue'
import Button from '../Button/index.vue'
import Input from '../Input/index.vue'
import ButtonGroup from './index.vue'

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    class: { control: 'text' },
  },
  args: {
    class: '',
  },
  render: args => ({
    components: { ButtonGroup, Button },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    `,
  }),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcons: Story = {
  render: () => ({
    components: { ButtonGroup, Button, Icon },
    template: `
      <ButtonGroup>
        <Button variant="outline" size="icon"><Icon name="bold" /></Button>
        <Button variant="outline" size="icon"><Icon name="italic" /></Button>
        <Button variant="outline" size="icon"><Icon name="underline" /></Button>
        <Button variant="outline" size="icon"><Icon name="strikethrough" /></Button>
      </ButtonGroup>
    `,
  }),
}

export const InputWithButton: Story = {
  render: () => ({
    components: { ButtonGroup, Button, Input, Icon },
    setup () {
      const search = ref('')
      return { search }
    },
    template: `
      <ButtonGroup>
        <Input v-model="search" placeholder="Search..." />
        <Button variant="outline"><Icon name="search" /></Button>
      </ButtonGroup>
    `,
  }),
}

export const ButtonWithInputWithButton: Story = {
  render: () => ({
    components: { ButtonGroup, Button, Input, Icon },
    template: `
      <ButtonGroup>
        <Button variant="outline" size="icon"><Icon name="minus" /></Button>
        <Input class="w-20 text-center" model-value="5" />
        <Button variant="outline" size="icon"><Icon name="plus" /></Button>
      </ButtonGroup>
    `,
  }),
}

export const MixedVariants: Story = {
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <ButtonGroup>
        <Button variant="outline">Save</Button>
        <Button>Submit</Button>
      </ButtonGroup>
    `,
  }),
}
