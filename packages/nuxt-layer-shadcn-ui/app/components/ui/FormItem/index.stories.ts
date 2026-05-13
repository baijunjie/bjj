import type { Meta, StoryObj } from '@storybook/vue3'
import type { RadioCardGroupOption } from '../RadioCardGroup/types'
import type { RadioGroupItem } from '../RadioGroup/types'
import type { SelectOption } from '../Select/types'
import type {
  SearchSelectLoadMethodParams,
  SearchSelectLoadMethodResult,
} from '../SearchSelect/types'
import Checkbox from '../Checkbox/index.vue'
import DatePicker from '../DatePicker/index.vue'
import DateRangePicker from '../DateRangePicker/index.vue'
import Input from '../Input/index.vue'
import InputCurrency from '../InputCurrency/index.vue'
import InputNumber from '../InputNumber/index.vue'
import InputOtp from '../InputOtp/index.vue'
import InputPercent from '../InputPercent/index.vue'
import InputRange from '../InputRange/index.vue'
import RadioCardGroup from '../RadioCardGroup/index.vue'
import RadioGroup from '../RadioGroup/index.vue'
import SearchSelect from '../SearchSelect/index.vue'
import Select from '../Select/index.vue'
import Textarea from '../Textarea/index.vue'
import FormItem from './index.vue'

const orientations = [ 'vertical', 'horizontal', 'responsive' ] as const

const meta = {
  title: 'UI/FormItem',
  component: FormItem,
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    description: { control: 'text' },
    required: { control: 'boolean' },
    orientation: { control: 'select', options: orientations },
    class: { control: 'text' },
  },
  args: {
    label: 'Name',
    error: '',
    description: '',
    required: false,
    orientation: 'vertical',
    class: '',
  },
  render: args => ({
    components: { FormItem, Input },
    setup: () => ({ args }),
    template: `
      <div class="max-w-md">
        <FormItem v-bind="args">
          <Input placeholder="Enter value" />
        </FormItem>
      </div>
    `,
  }),
} satisfies Meta<typeof FormItem>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const Required: Story = {
  parameters: noControls,
  args: {
    label: 'Email',
    required: true,
  },
}

export const WithDescription: Story = {
  parameters: noControls,
  args: {
    label: 'Password',
    description: 'Must be at least 8 characters long',
  },
}

export const Horizontal: Story = {
  parameters: noControls,
  args: {
    label: 'Display Name',
    orientation: 'horizontal',
  },
}

const selectOptions: SelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
]

const radioOptions: RadioGroupItem[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

const radioCardOptions: RadioCardGroupOption[] = [
  { value: 'card-a', title: 'Card A', description: 'First option' },
  { value: 'card-b', title: 'Card B', description: 'Second option' },
]

function mockLoadMethod (params: SearchSelectLoadMethodParams): Promise<SearchSelectLoadMethodResult<string>> {
  const items = selectOptions.slice(params.offset, params.offset + params.limit)
  return Promise.resolve({ items, total: selectOptions.length })
}

export const InvalidControls: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'Every input-like control automatically inherits the surrounding `FormItem`\'s error state via provide/inject — no need to wire `invalid` on each control. The same destructive styling appears whether the error comes from `<FormItem :error>` or the control\'s own `invalid` prop.',
      },
      source: {
        code: `
<template>
  <FormItem required label="Username" error="Required">
    <Input placeholder="Type your username" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: {
      FormItem,
      Input,
      Textarea,
      InputNumber,
      InputCurrency,
      InputPercent,
      InputRange,
      InputOtp,
      Select,
      SearchSelect,
      DatePicker,
      DateRangePicker,
      Checkbox,
      RadioGroup,
      RadioCardGroup,
    },
    setup: () => ({
      error: 'This field is required',
      selectOptions,
      radioOptions,
      radioCardOptions,
      mockLoadMethod,
    }),
    template: `
      <div class="max-w-md space-y-4">
        <FormItem required label="Input" :error="error">
          <Input placeholder="Type something" />
        </FormItem>
        <FormItem required label="Textarea" :error="error">
          <Textarea placeholder="Long text" />
        </FormItem>
        <FormItem required label="InputNumber" :error="error">
          <InputNumber />
        </FormItem>
        <FormItem required label="InputCurrency" :error="error">
          <InputCurrency :modelValue="1000" currency="JPY" />
        </FormItem>
        <FormItem required label="InputPercent" :error="error">
          <InputPercent :modelValue="0.5" />
        </FormItem>
        <FormItem required label="InputRange" :error="error">
          <InputRange />
        </FormItem>
        <FormItem required label="InputOtp" :error="error">
          <InputOtp />
        </FormItem>
        <FormItem required label="Select" :error="error">
          <Select :options="selectOptions" placeholder="Pick a framework" />
        </FormItem>
        <FormItem required label="SearchSelect" :error="error">
          <SearchSelect :loadMethod="mockLoadMethod" autoLoad />
        </FormItem>
        <FormItem required label="DatePicker" :error="error">
          <DatePicker />
        </FormItem>
        <FormItem required label="DateRangePicker" :error="error">
          <DateRangePicker />
        </FormItem>
        <FormItem required label="Checkbox" :error="error">
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span class="text-sm">Accept terms</span>
          </label>
        </FormItem>
        <FormItem required label="RadioGroup" :error="error">
          <RadioGroup :items="radioOptions" />
        </FormItem>
        <FormItem required label="RadioCardGroup" :error="error">
          <RadioCardGroup :options="radioCardOptions" />
        </FormItem>
      </div>
    `,
  }),
}

export const Responsive: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <div class="@container/field-group resize-x overflow-auto rounded border border-dashed border-border bg-card p-4" style="min-width: 200px;">
    <FormItem label="Address" orientation="responsive" description="Your mailing address">
      <Input placeholder="Enter address" />
    </FormItem>
  </div>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <div class="@container/field-group resize-x overflow-auto rounded border border-dashed border-border bg-card p-4" style="min-width: 200px;">
          <FormItem required label="Address" orientation="responsive" description="Your mailing address">
            <Input placeholder="Enter address" />
          </FormItem>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">Drag the right edge to resize horizontally.</p>
      </div>
    `,
  }),
}
