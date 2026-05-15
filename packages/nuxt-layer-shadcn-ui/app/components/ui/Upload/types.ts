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
  variant?: UploadVariant
  accept?: string
  beforeUpload?: UploadBeforeUpload
  upload?: UploadHandler
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  fileList?: UploadFile[]
  multiple?: boolean
  maxCount?: number
  maxSize?: number
  text?: string
  icon?: string | Component
  directory?: boolean
  class?: ClassValue
}
