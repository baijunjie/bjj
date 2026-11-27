import type { InputNumberProps } from '../InputNumber/types'

export interface InputCurrencyProps extends /* @vue-ignore */ Pick<InputNumberProps, 'readonly' | 'disabled' | 'invalid' | 'align' | 'size' | 'rounded' | 'class'> {
  currency?: string
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}
