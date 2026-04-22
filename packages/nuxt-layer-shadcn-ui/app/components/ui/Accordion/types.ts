export interface AccordionItem {
  value: string
  title?: string
  content?: string
  disabled?: boolean
}

export type AccordionBaseProps = {
  items?: AccordionItem[]
  disabled?: boolean
}

export type AccordionSingleProps = AccordionBaseProps & {
  type?: 'single'
  modelValue?: string
  defaultValue?: string
  /** Only applies to single type: whether the open item can be toggled closed. */
  collapsible?: boolean
}

export type AccordionMultipleProps = AccordionBaseProps & {
  type?: 'multiple'
  modelValue?: string[]
  defaultValue?: string[]
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps
