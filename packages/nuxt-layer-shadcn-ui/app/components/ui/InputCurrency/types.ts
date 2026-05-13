import type { InputNumberProps } from '../InputNumber/types'

export interface InputCurrencyProps extends /* @vue-ignore */ Pick<InputNumberProps, 'invalid'> {
  currency?: string
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}
