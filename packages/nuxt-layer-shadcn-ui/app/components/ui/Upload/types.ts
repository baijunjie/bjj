import type { Component } from 'vue'

export type UploadVariant = 'button' | 'box' | 'drag'

export type UploadFileStatus = 'uploading' | 'done' | 'error'

export interface UploadFile {
  uid?: string | number
  name: string
  url?: string
  status?: UploadFileStatus
  raw?: File | Blob
}

export type UploadBeforeUpload
  = (file: File) => boolean | undefined | Promise<File | Blob | boolean | undefined>

export type UploadHandler = (files: (File | Blob)[]) => Promise<unknown>

export interface UploadProps {
  /** Trigger appearance: button, thumbnail grid box, or drag-and-drop area */
  variant?: UploadVariant
  /** Accepted file types, same format as the native `<input accept>` (also enforced on drag-drop) */
  accept?: string
  /** Called per file before upload; return `false` to skip, or a `File | Blob` to replace it */
  beforeUpload?: UploadBeforeUpload
  /** Uploads the accepted files; rejection marks them as error */
  upload?: UploadHandler
  /** Disable the trigger and file removal */
  disabled?: boolean
  /** Hide the trigger and only display the file list */
  readonly?: boolean
  /** Show the invalid (error) style */
  invalid?: boolean
  /** Controlled file list, used with `v-model:fileList` */
  fileList?: UploadFile[]
  /** Allow selecting multiple files at once */
  multiple?: boolean
  /** Maximum number of files */
  maxCount?: number
  /** Maximum size per file in bytes */
  maxSize?: number
  /** Custom trigger text */
  text?: string
  /** Custom trigger icon */
  icon?: string | Component
  /** Hide the upload trigger instead of disabling it when maxCount is reached */
  hideTriggerOnMax?: boolean
  /** Hide the hint lines below the trigger */
  hideHint?: boolean
  /** Allow selecting a directory and upload its contents */
  directory?: boolean
  /** Class of the root element */
  class?: ClassValue
}
