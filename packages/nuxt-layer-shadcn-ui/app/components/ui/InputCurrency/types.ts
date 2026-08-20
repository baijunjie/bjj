import type { InputNumberProps } from '../InputNumber/types'

export interface InputCurrencyProps extends /* @vue-ignore */ Pick<InputNumberProps, 'readonly' | 'disabled' | 'invalid' | 'align' | 'class'> {
  currency?: string
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}
