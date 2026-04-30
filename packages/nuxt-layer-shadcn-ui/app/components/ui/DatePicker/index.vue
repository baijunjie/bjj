<script setup lang="ts">
import type { Locale } from 'date-fns'
import type { DatePickerProps } from './types'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { enUS } from 'date-fns/locale/en-US'
import { ja } from 'date-fns/locale/ja'
import '@vuepic/vue-datepicker/dist/main.css'
import './style.css'

const dateFnsLocaleMap: Record<string, Locale> = {
  ja,
  en: enUS,
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: undefined,
  type: 'date',
  showTime: false,
  disabled: false,
  readonly: false,
  placeholder: undefined,
  minDate: undefined,
  maxDate: undefined,
  valueFormat: undefined,
  autoApply: true,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | string | null]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value ?? null),
})

const T = useTranslations('components.ui.DatePicker')

const { locale: i18nLocale } = useI18n()
const dateFnsLocale = computed(() => dateFnsLocaleMap[i18nLocale.value] ?? ja)

const hasTime = computed(() => !!props.showTime)

const formatKey = computed(() => {
  if (props.type === 'year') return 'year'
  if (props.type === 'month') return 'month'
  if (hasTime.value) return 'dateTime'
  return 'date'
})

const defaultFormat = computed(() => T(`format.${formatKey.value}`))

const timeConfig = computed(() => {
  if (typeof props.showTime === 'object') {
    return { enableTimePicker: true, ...props.showTime }
  }
  return { enableTimePicker: props.showTime }
})
</script>

<template>
  <VueDatePicker
    v-model="model"
    v-bind="$attrs"
    :class="props.class"
    :locale="dateFnsLocale"
    :timeConfig="timeConfig"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    :minDate="minDate"
    :maxDate="maxDate"
    :formats="{ input: defaultFormat }"
    :modelType="valueFormat"
    :monthPicker="type === 'month'"
    :yearPicker="type === 'year'"
    :autoApply="autoApply"
    :inputAttrs="{ clearable: false }"
    :teleport="true"
    textInput
  >
    <template #dp-input="{ value, onInput, onEnter, onTab, onClear, onBlur, onFocus, openMenu }">
      <div @click.stop>
        <Input
          :modelValue="value"
          :placeholder="placeholder ?? T('placeholder')"
          :disabled="disabled"
          :readonly="readonly"
          @update:modelValue="(v: string | undefined) => onInput(v ?? '')"
          @keydown.enter="onEnter"
          @keydown.tab="onTab"
          @change="(v: string | undefined) => { if (!v) onClear() }"
          @blur="onBlur"
          @focus="() => { onFocus(); openMenu() }"
        >
          <template #prefix>
            <Icon
              name="calendar-days"
              class="text-muted-foreground cursor-pointer"
              @click="openMenu"
            />
          </template>
        </Input>
      </div>
    </template>
    <template #arrow-left>
      <Icon name="chevron-left" />
    </template>
    <template #arrow-right>
      <Icon name="chevron-right" />
    </template>
    <template #arrow-up>
      <Icon name="chevron-up" />
    </template>
    <template #arrow-down>
      <Icon name="chevron-down" />
    </template>
    <template #calendar-icon>
      <Icon name="calendar-days" />
    </template>
    <template #clock-icon>
      <Icon name="clock" />
    </template>
  </VueDatePicker>
</template>
