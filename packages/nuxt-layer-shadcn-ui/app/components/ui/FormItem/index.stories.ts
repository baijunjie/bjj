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
import Help from '../Help/index.vue'
import Icon from '../Icon/index.vue'
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

export const LabelSlot: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'The `#label` slot replaces the label text (defaults to the `label` prop). The required asterisk is still appended, and the slot alone is enough to render the label row.',
      },
      source: {
        code: `
<template>
  <FormItem required>
    <template #label>
      Nickname <span class="text-muted-foreground font-normal">(optional display)</span>
    </template>
    <Input placeholder="Enter value" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { FormItem, Input },
    template: `
      <div class="max-w-md">
        <FormItem required>
          <template #label>
            Nickname <span class="text-muted-foreground font-normal">(optional display)</span>
          </template>
          <Input placeholder="Enter value" />
        </FormItem>
      </div>
    `,
  }),
}

export const LabelSuffix: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'The `#labelSuffix` slot appends inline content after the label text and the required asterisk.',
      },
      source: {
        code: `
<template>
  <FormItem required label="API Key">
    <template #labelSuffix>
      <Help text="Find it under Settings → Developers" />
    </template>
    <Input placeholder="Enter value" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { FormItem, Input, Help },
    template: `
      <div class="max-w-md space-y-6">
        <FormItem required label="API Key">
          <template #labelSuffix>
            <Help text="Find it under Settings → Developers" />
          </template>
          <Input placeholder="Enter value" />
        </FormItem>
        <FormItem label="Webhook URL">
          <template #labelSuffix>
            <span class="text-muted-foreground font-normal">(optional)</span>
          </template>
          <Input placeholder="Enter value" />
        </FormItem>
      </div>
    `,
  }),
}

export const LabelExtra: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'The `#labelExtra` slot puts extra content on the label row, aligned to the trailing edge. In `horizontal` orientation it sits right after the label in the label column.',
      },
      source: {
        code: `
<template>
  <FormItem required label="English">
    <template #labelExtra>
      <span class="inline-flex items-center gap-1 text-success">
        <Icon name="check" class="size-3.5" /> Filled
      </span>
    </template>
    <Input placeholder="Enter value" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { FormItem, Input, Icon },
    setup: () => ({ orientations }),
    template: `
      <div class="max-w-md space-y-6">
        <FormItem
          v-for="o in orientations"
          :key="o"
          required
          :label="o"
          :orientation="o"
        >
          <template #labelExtra>
            <span class="inline-flex items-center gap-1 text-success">
              <Icon name="check" class="size-3.5" /> Filled
            </span>
          </template>
          <Input placeholder="Enter value" />
        </FormItem>
      </div>
    `,
  }),
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

export const LabelAssociation: Story = {
  parameters: {
    ...noControls,
    docs: {
      description: {
        story: 'The label, description and error are associated with the control automatically, so screen readers announce the label as the control\'s name without a separate `aria-label`. A native input, textarea or checkbox is targeted by the label\'s `for` (clicking the label focuses it); a custom widget such as `Select` or `RadioGroup` gets `aria-labelledby`. The description and error are linked via `aria-describedby`. With several controls in one `FormItem` (e.g. `InputRange`), the label names the field group instead of any single control. An `aria-label` / `aria-labelledby` passed to the control, or an explicit `id`, takes precedence.',
      },
      source: {
        code: `
<template>
  <FormItem label="Email" description="We never share it">
    <Input />
  </FormItem>
  <FormItem label="Framework" error="Required">
    <Select :options="options" />
  </FormItem>
  <FormItem label="Price range">
    <InputRange />
  </FormItem>
  <FormItem label="Phone">
    <Input aria-label="Phone number without country code" />
  </FormItem>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { FormItem, Input, Select, InputRange },
    setup: () => ({ selectOptions }),
    template: `
      <div class="max-w-md space-y-4">
        <FormItem label="Email" description="We never share it">
          <Input />
        </FormItem>
        <FormItem label="Framework" error="Required">
          <Select :options="selectOptions" />
        </FormItem>
        <FormItem label="Price range">
          <InputRange />
        </FormItem>
        <FormItem label="Phone">
          <Input aria-label="Phone number without country code" />
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
