import { useArgs } from 'storybook/preview-api'

export function useArgsModel<T = unknown> (key: string = 'modelValue') {
  const [ , updateArgs ] = useArgs()
  return (value: T) => updateArgs({ [key]: value })
}
