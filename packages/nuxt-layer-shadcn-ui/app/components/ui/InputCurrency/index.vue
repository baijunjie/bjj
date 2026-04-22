<script setup lang="ts">
import type { InputCurrencyProps } from './types'

const props = withDefaults(defineProps<InputCurrencyProps>(), {
  currency: 'JPY',
  currencyDisplay: 'symbol',
})

const formatOptions = computed<Intl.NumberFormatOptions>(() => ({
  style: 'currency',
  currency: props.currency,
  currencyDisplay: props.currencyDisplay,
}))

// Derive step from currency's minor unit (e.g. JPY→1, USD→0.01, BHD→0.001)
const defaultStep = computed(() => {
  const { minimumFractionDigits } = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: props.currency,
  }).resolvedOptions()
  return 1 / (10 ** (minimumFractionDigits ?? 0))
})
</script>

<template>
  <InputNumber
    :formatOptions="formatOptions"
    :min="0"
    :step="defaultStep"
  />
</template>
