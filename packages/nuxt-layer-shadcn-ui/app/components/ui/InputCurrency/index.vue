<script setup lang="ts">
import type { InputCurrencyProps } from './types'

const props = withDefaults(defineProps<InputCurrencyProps>(), {
  currency: 'USD',
  currencyDisplay: 'symbol',
})

const formatOptions = computed<Intl.NumberFormatOptions>(() => ({
  style: 'currency',
  currency: props.currency,
  currencyDisplay: props.currencyDisplay,
}))

// Step matches the currency's minor unit (JPY→1, USD→0.01, BHD→0.001).
const defaultStep = computed(() => {
  const { minimumFractionDigits } = new Intl.NumberFormat('en', formatOptions.value).resolvedOptions()
  return 1 / (10 ** (minimumFractionDigits ?? 0))
})
</script>

<template>
  <InputNumber
    :formatOptions="formatOptions"
    :min="0"
    :step="defaultStep"
    @beforeinput="guardSymbolDeletion"
  />
</template>
