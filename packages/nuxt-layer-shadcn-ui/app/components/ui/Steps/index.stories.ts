import type { Meta, StoryObj } from '@storybook/vue3'
import type { StepsItem } from './types'
import { useArgsModel } from '#storybook/argsModel'
import Steps from './index.vue'

const orientations = [ 'horizontal', 'vertical' ] as const

const basicItems: StepsItem[] = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Fill in your profile' },
  { title: 'Confirm', description: 'Review and submit' },
]

const iconItems: StepsItem[] = [
  { title: 'Account', description: 'Create your account', icon: 'user-plus' },
  { title: 'Payment', description: 'Add a payment method', icon: 'credit-card' },
  { title: 'Done', description: 'You are all set', icon: 'flag' },
]

const disabledItems: StepsItem[] = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Fill in your profile' },
  { title: 'Review', description: 'disabled: true', disabled: true },
  { title: 'Done', description: 'You are all set' },
]

const completedItems: StepsItem[] = [
  { title: 'Cart', description: 'Items added' },
  { title: 'Shipping', description: 'In progress' },
  { title: 'Payment', description: 'completed: true', completed: true },
  { title: 'Done', description: 'Order complete' },
]

const titleOnlyItems: StepsItem[] = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

const customSlotItems: StepsItem[] = [
  { title: 'Account', description: 'Create your account', icon: 'user-plus' },
  { title: 'Payment', description: 'Add a payment method', icon: 'credit-card' },
  { title: 'Confirm', description: 'Review and submit', icon: 'flag' },
]

const meta = {
  title: 'UI/Steps',
  component: Steps,
  argTypes: {
    items: { control: 'object' },
    modelValue: { control: 'number' },
    defaultValue: { control: 'number' },
    orientation: { control: 'inline-radio', options: orientations },
    linear: { control: 'boolean' },
  },
  args: {
    items: basicItems,
    modelValue: 2,
    defaultValue: undefined,
    orientation: 'horizontal',
    linear: false,
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { Steps },
      setup: () => ({ args, onUpdate }),
      template: `
        <Steps v-bind="args" @update:modelValue="onUpdate" />
      `,
    }
  },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const TitleOnly: Story = {
  parameters: noControls,
  args: {
    items: titleOnlyItems,
    modelValue: 2,
  },
}

export const WithIcons: Story = {
  parameters: noControls,
  args: {
    items: iconItems,
    modelValue: 2,
  },
}

export const Vertical: Story = {
  parameters: noControls,
  args: {
    items: iconItems,
    modelValue: 2,
    orientation: 'vertical',
  },
}

export const WithDisabledItem: Story = {
  parameters: noControls,
  args: {
    items: disabledItems,
    modelValue: 2,
  },
}

export const WithCompletedFlag: Story = {
  parameters: noControls,
  args: {
    items: completedItems,
    modelValue: 2,
  },
}

export const Linear: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="flex flex-col gap-8">
    <div>
      <p class="mb-3 text-sm text-muted-foreground">
        <code>linear: false</code> — click any step to jump there freely.
      </p>
      <Steps :items="items" v-model="freeStep" :linear="false" />
    </div>
    <div>
      <p class="mb-3 text-sm text-muted-foreground">
        <code>linear: true</code> — only the next adjacent step is reachable; skipping ahead is blocked.
      </p>
      <Steps :items="items" v-model="linearStep" linear />
    </div>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Steps },
    setup () {
      const freeStep = ref(1)
      const linearStep = ref(1)
      return { freeStep, linearStep, items: basicItems }
    },
    template: `
      <div class="flex flex-col gap-8">
        <div>
          <p class="mb-3 text-sm text-muted-foreground">
            <code>linear: false</code> — click any step to jump there freely.
          </p>
          <Steps :items="items" v-model="freeStep" :linear="false" />
        </div>
        <div>
          <p class="mb-3 text-sm text-muted-foreground">
            <code>linear: true</code> — only the next adjacent step is reachable; skipping ahead is blocked.
          </p>
          <Steps :items="items" v-model="linearStep" linear />
        </div>
      </div>
    `,
  }),
}

export const CustomSlots: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Steps :items="items" :modelValue="2">
    <template #title="{ item, step, state }">
      <span class="flex items-center gap-1">
        <span class="font-mono text-xs text-muted-foreground">#{{ step }}</span>
        <span :class="state === 'active' ? 'text-primary' : ''">{{ item.title }}</span>
      </span>
    </template>
    <template #description="{ item, state }">
      <span :class="state === 'completed' ? 'text-accent-foreground' : 'text-muted-foreground'">
        {{ state === 'completed' ? 'Done — ' : '' }}{{ item.description }}
      </span>
    </template>
  </Steps>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Steps },
    setup: () => ({ items: customSlotItems }),
    template: `
      <Steps :items="items" :modelValue="2">
        <template #title="{ item, step, state }">
          <span class="flex items-center gap-1">
            <span class="font-mono text-xs text-muted-foreground">#{{ step }}</span>
            <span :class="state === 'active' ? 'text-primary' : ''">{{ item.title }}</span>
          </span>
        </template>
        <template #description="{ item, state }">
          <span :class="state === 'completed' ? 'text-accent-foreground' : 'text-muted-foreground'">
            {{ state === 'completed' ? 'Done — ' : '' }}{{ item.description }}
          </span>
        </template>
      </Steps>
    `,
  }),
}
