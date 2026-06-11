<script setup lang="ts">
import type { UploadFile, UploadProps } from './types'

const props = withDefaults(defineProps<UploadProps>(), {
  variant: 'button',
  accept: undefined,
  beforeUpload: undefined,
  upload: undefined,
  disabled: false,
  readonly: false,
  invalid: false,
  fileList: undefined,
  multiple: false,
  maxCount: undefined,
  maxSize: undefined,
  text: undefined,
  icon: undefined,
  hideTriggerOnMax: false,
  directory: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  'change': [files: UploadFile[]]
  'remove': [file: UploadFile]
  'preview': [file: UploadFile]
  'error': [error: unknown]
}>()

const T = useTranslations('components.ui.Upload')
const isInvalid = useFormItemInvalid(() => props.invalid)

const inputRef = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const uploadingFiles = ref<UploadFile[]>([])
const imageLoadErrors = ref<Set<string | number>>(new Set())
const internalError = ref('')
const internalFileList = ref<UploadFile[]>([])

const previewVisible = ref(false)
const previewFileItem = ref<UploadFile | null>(null)

const objectUrls = new Set<string>()
function trackObjectUrl (url: string | undefined) {
  if (url) objectUrls.add(url)
}
onBeforeUnmount(() => {
  objectUrls.forEach(url => URL.revokeObjectURL(url))
  objectUrls.clear()
})

function nextUid () {
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const isControlled = computed(() => props.fileList !== undefined)

const effectiveFileList = computed<UploadFile[]>(() =>
  isControlled.value ? (props.fileList ?? []) : internalFileList.value,
)

const displayList = computed<UploadFile[]>(() => [
  ...effectiveFileList.value,
  ...uploadingFiles.value,
])

const reachedMax = computed(() =>
  !!props.maxCount && displayList.value.length >= props.maxCount,
)

const canPickMore = computed(() =>
  !props.disabled && !props.readonly && !reachedMax.value,
)

const canRemove = computed(() => !props.disabled && !props.readonly)

const showTrigger = computed(() =>
  !props.readonly && !(props.hideTriggerOnMax && reachedMax.value),
)

const emptyStateClass = 'py-2 text-xs text-muted-foreground'

const overlayIconButtonClass = `
  text-white/80
  hover:text-white
  cursor-pointer transition
  hover:scale-110
`

function formatBytes (bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`
}

const maxSizeLabel = computed(() => props.maxSize ? formatBytes(props.maxSize) : '')

const acceptLabel = computed(() => {
  if (!props.accept) return ''
  return props.accept
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      if (s === 'image/*') return T('hint.acceptImage')
      if (s === 'video/*') return T('hint.acceptVideo')
      if (s === 'audio/*') return T('hint.acceptAudio')
      if (s.startsWith('.')) return s.slice(1).toUpperCase()
      if (s.endsWith('/*')) return s
      if (s.includes('/')) return s.split('/')[1]!.toUpperCase()
      return s
    })
    .join(', ')
})

const allowMany = computed(() => props.multiple || props.directory)

const hintLines = computed(() => {
  const lines: string[] = []
  if (!allowMany.value) lines.push(T('hint.single'))
  else if (props.maxCount) lines.push(T('hint.max', { max: props.maxCount }))
  else lines.push(T('hint.multiple'))
  if (maxSizeLabel.value) lines.push(T('hint.maxSize', { size: maxSizeLabel.value }))
  if (acceptLabel.value) lines.push(T('hint.accept', { types: acceptLabel.value }))
  return lines
})

defineSlots<{
  hint?: (props: { lines: string[] }) => any
}>()

const triggerLabel = computed(() => {
  if (props.text) return props.text
  if (props.variant === 'drag') {
    if (props.directory) return T('drag.titleDirectory')
    return allowMany.value ? T('drag.titleMultiple') : T('drag.title')
  }
  return props.directory ? T('uploadDirectory') : T('upload')
})

const iconName = computed(() => {
  if (props.icon) return props.icon
  if (props.variant === 'box') return 'plus'
  if (props.variant === 'drag') return 'inbox'
  return 'upload'
})

const rootClass = computed(() => cn('w-full', props.class))

const dragAreaBase = `
  group/upload
  flex cursor-pointer flex-col items-center justify-center gap-2
  rounded-md border border-dashed bg-muted/40 px-6 py-10
  text-center transition-colors
  dark:bg-muted/20
`

const boxTriggerBase = `
  flex size-24 shrink-0 cursor-pointer flex-col items-center justify-center
  gap-1 rounded-md border border-dashed bg-muted/40 text-xs
  text-muted-foreground transition-colors
  dark:bg-muted/20
`

const disabledClass = 'pointer-events-none cursor-not-allowed opacity-60'

function makeTriggerClass (base: string, idleHover: string) {
  return cn(
    base,
    isInvalid.value ? 'border-danger' : idleHover,
    isDragOver.value && !isInvalid.value && 'border-primary bg-primary/5',
    (props.disabled || reachedMax.value) && disabledClass,
  )
}

const dragAreaClass = computed(() => makeTriggerClass(
  dragAreaBase,
  `
    border-border
    hover:border-primary
  `,
))

const boxTriggerClass = computed(() => makeTriggerClass(
  boxTriggerBase,
  `
    border-border
    hover:border-primary hover:text-primary
  `,
))

const thumbBase = `
  group/thumb
  relative size-24 shrink-0 overflow-hidden rounded-md border bg-muted/40
  dark:bg-muted/20
`

const rowItemBase = `
  group/row
  flex items-center gap-2 rounded-sm px-1 py-1 text-sm
  hover:bg-muted/60
`

function thumbClass (file: UploadFile) {
  const isError = file.status === 'error' || isInvalid.value
  return cn(thumbBase, isError ? 'border-danger' : 'border-border')
}

function rowItemClass (file: UploadFile) {
  const isError = file.status === 'error' || isInvalid.value
  return cn(rowItemBase, isError && 'text-danger')
}

function isImageFile (file: UploadFile) {
  if (file.uid != null && imageLoadErrors.value.has(file.uid)) return false
  if (file.raw && file.raw.type) return file.raw.type.startsWith('image/')
  return !!file.url
}

function onImageError (file: UploadFile) {
  if (file.uid != null) imageLoadErrors.value.add(file.uid)
}

// Native <input accept> only filters in the file picker; drag-drop bypasses it,
// so we mirror the same patterns in JS for both paths.
function matchesAccept (file: File, accept: string) {
  const patterns = accept.split(',').map(s => s.trim()).filter(Boolean)
  if (!patterns.length) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some(raw => {
    const p = raw.toLowerCase()
    if (p.startsWith('.')) return name.endsWith(p)
    if (p.endsWith('/*')) return type.startsWith(p.slice(0, -1))
    return type === p
  })
}

function reportError (err: Error) {
  internalError.value = err.message
  emit('error', err)
}

async function processFiles (files: File[]) {
  if (!files.length) return
  internalError.value = ''

  let candidates = files
  if (!allowMany.value && candidates.length > 1) candidates = [ candidates[0]! ]

  if (props.accept) {
    const accept = props.accept
    const rejected = candidates.filter(f => !matchesAccept(f, accept))
    if (rejected.length) {
      const names = rejected.map(f => f.name).join(', ')
      reportError(new Error(T('error.accept', { files: names, accept: acceptLabel.value })))
      candidates = candidates.filter(f => matchesAccept(f, accept))
    }
  }

  if (props.maxCount) {
    const remaining = props.maxCount - displayList.value.length
    if (remaining <= 0) return
    candidates = candidates.slice(0, remaining)
  }

  if (props.maxSize) {
    const limit = props.maxSize
    const oversize = candidates.filter(f => f.size > limit)
    if (oversize.length) {
      const names = oversize.map(f => f.name).join(', ')
      reportError(new Error(T('error.oversize', { files: names, size: formatBytes(limit) })))
      candidates = candidates.filter(f => f.size <= limit)
    }
  }

  const accepted: (File | Blob)[] = []
  for (const file of candidates) {
    if (!props.beforeUpload) {
      accepted.push(file)
      continue
    }
    try {
      const result = await props.beforeUpload(file)
      if (result === false) continue
      if (result instanceof File || result instanceof Blob) {
        accepted.push(result)
      } else {
        accepted.push(file)
      }
    } catch {
      // beforeUpload rejected — skip this file
    }
  }

  if (!accepted.length) return

  const entries: UploadFile[] = accepted.map((raw, i) => {
    const isFile = raw instanceof File
    const name = isFile ? raw.name : (candidates[i]?.name ?? 'file')
    const url = raw.type.startsWith('image/') ? URL.createObjectURL(raw) : undefined
    trackObjectUrl(url)
    return {
      uid: nextUid(),
      name,
      url,
      status: 'uploading',
      raw,
    }
  })

  uploadingFiles.value.push(...entries)

  if (!props.upload) {
    finishUpload(entries, true)
    return
  }

  try {
    await props.upload(accepted)
    finishUpload(entries, true)
  } catch (err) {
    finishUpload(entries, false)
    reportError(err instanceof Error ? err : new Error(String(err)))
  }
}

function finishUpload (entries: UploadFile[], ok: boolean) {
  const entryUids = new Set(entries.map(e => e.uid))
  uploadingFiles.value = uploadingFiles.value.filter(e => !entryUids.has(e.uid))

  if (!ok) {
    uploadingFiles.value.push(...entries.map(e => ({ ...e, status: 'error' as const })))
    return
  }

  const done = entries.map(e => ({ ...e, status: 'done' as const }))
  const next = [ ...effectiveFileList.value, ...done ]
  if (!isControlled.value) internalFileList.value = next
  emit('update:fileList', next)
  emit('change', next)
}

function onInputChange (e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) processFiles(Array.from(target.files))
  target.value = ''
}

function triggerSelect () {
  if (!canPickMore.value) return
  inputRef.value?.click()
}

function removeFile (file: UploadFile) {
  const inUploading = uploadingFiles.value.some(f => f.uid === file.uid)
  if (inUploading) {
    uploadingFiles.value = uploadingFiles.value.filter(f => f.uid !== file.uid)
  } else {
    const next = effectiveFileList.value.filter(f => f.uid !== file.uid)
    if (!isControlled.value) internalFileList.value = next
    emit('update:fileList', next)
    emit('change', next)
  }
  emit('remove', file)
}

function previewFile (file: UploadFile) {
  emit('preview', file)
  if (isImageFile(file) && file.url) {
    previewFileItem.value = file
    previewVisible.value = true
  }
}

function onDragOver (e: DragEvent) {
  e.preventDefault()
  if (canPickMore.value) isDragOver.value = true
}
function onDragLeave (e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
}

// Recursively read a FileSystemEntry into a flat File[] so dropped directories
// expand to their contents. readEntries returns at most ~100 children per call
// and must be looped until it yields an empty batch.
async function readEntry (entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return new Promise(resolve => {
      (entry as FileSystemFileEntry).file(f => resolve([ f ]), () => resolve([]))
    })
  }
  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    const children: FileSystemEntry[] = []
    while (true) {
      const batch = await new Promise<FileSystemEntry[]>(resolve => {
        reader.readEntries(entries => resolve(entries), () => resolve([]))
      })
      if (!batch.length) break
      children.push(...batch)
    }
    const nested = await Promise.all(children.map(readEntry))
    return nested.flat()
  }
  return []
}

async function onDrop (e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (!canPickMore.value) return

  const items = e.dataTransfer?.items
  if (items?.length && typeof items[0]?.webkitGetAsEntry === 'function') {
    const entries = Array.from(items)
      .map(item => item.webkitGetAsEntry())
      .filter((entry): entry is FileSystemEntry => !!entry)
    const nested = await Promise.all(entries.map(readEntry))
    const files = nested.flat()
    if (files.length) processFiles(files)
    return
  }

  const files = e.dataTransfer?.files
  if (files?.length) processFiles(Array.from(files))
}
</script>

<template>
  <div :class="rootClass">
    <!-- Hidden native input -->
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :webkitdirectory="directory || undefined"
      @change="onInputChange"
    >

    <!-- button variant: button trigger -->
    <div
      v-if="variant === 'button' && showTrigger"
      class="gap-3 flex flex-wrap items-center"
    >
      <Button
        variant="outline"
        :disabled="disabled || reachedMax"
        @click="triggerSelect"
      >
        <Icon :name="iconName" />
        {{ triggerLabel }}
      </Button>
      <div class="text-xs text-muted-foreground py-1.5">
        <slot
          name="hint"
          :lines="hintLines"
        >
          <div
            v-for="line in hintLines"
            :key="line"
          >
            {{ line }}
          </div>
        </slot>
      </div>
    </div>

    <!-- drag variant: dashed drop area trigger -->
    <div
      v-else-if="variant === 'drag' && showTrigger"
      :class="dragAreaClass"
      role="button"
      :aria-disabled="disabled || reachedMax || undefined"
      @click="triggerSelect"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <Icon
        :name="iconName"
        class="size-10 text-primary"
        :class="isInvalid && 'text-danger'"
      />
      <div class="text-foreground font-medium">
        {{ triggerLabel }}
      </div>
      <div class="text-xs text-muted-foreground">
        <slot
          name="hint"
          :lines="hintLines"
        >
          <div
            v-for="line in hintLines"
            :key="line"
          >
            {{ line }}
          </div>
        </slot>
      </div>
    </div>

    <!-- Shared row list (button + drag) -->
    <template v-if="variant !== 'box'">
      <ul
        v-if="displayList.length"
        :class="[ showTrigger && 'mt-2', 'flex flex-col' ]"
      >
        <li
          v-for="file in displayList"
          :key="file.uid"
          :class="rowItemClass(file)"
        >
          <Icon
            name="paperclip"
            class="size-4 shrink-0"
          />
          <span class="min-w-0 flex-1 truncate">
            {{ file.name }}
          </span>
          <Icon
            v-if="file.status === 'uploading'"
            name="loader-circle"
            class="size-4 animate-spin text-muted-foreground shrink-0"
          />
          <button
            v-if="canRemove"
            type="button"
            class="
              text-muted-foreground
              hover:text-foreground
              shrink-0 cursor-pointer opacity-0 transition
              group-hover/row:opacity-100
            "
            :aria-label="T('remove')"
            @click="removeFile(file)"
          >
            <Icon name="trash-2" />
          </button>
        </li>
      </ul>
      <div
        v-else-if="!showTrigger"
        :class="emptyStateClass"
      >
        {{ T('empty') }}
      </div>
    </template>

    <!-- box variant: grid of thumbs + add-more box -->
    <template v-else>
      <div
        v-if="displayList.length || showTrigger"
        class="gap-3 flex flex-wrap items-start"
      >
        <div
          v-for="file in displayList"
          :key="file.uid"
          :class="thumbClass(file)"
        >
          <img
            v-if="isImageFile(file) && file.url"
            :src="file.url"
            :alt="file.name"
            class="size-full object-cover"
            @error="onImageError(file)"
          >
          <div
            v-else
            class="
              gap-1 p-2 flex size-full flex-col items-center justify-center
            "
          >
            <Icon
              name="image"
              class="size-6 text-muted-foreground"
              :class="file.status === 'error' && 'text-danger'"
            />
            <span
              class="px-1 leading-tight line-clamp-2 text-center text-[10px]"
            >
              {{ file.name }}
            </span>
          </div>

          <!-- Uploading overlay -->
          <div
            v-if="file.status === 'uploading'"
            class="
              inset-0 gap-2 bg-background/80 px-3 text-xs absolute flex flex-col
              items-center justify-center
            "
          >
            <span>{{ T('uploading') }}</span>
            <div class="h-1 bg-muted w-full overflow-hidden rounded-full">
              <div class="upload-progress bg-primary h-full" />
            </div>
          </div>

          <!-- Hover overlay -->
          <div
            v-else-if="isImageFile(file) || canRemove"
            class="
              inset-0 gap-3 bg-black/50 absolute flex items-center
              justify-center opacity-0 transition
              group-hover/thumb:opacity-100
            "
          >
            <button
              v-if="isImageFile(file) && file.url"
              type="button"
              :class="overlayIconButtonClass"
              :aria-label="T('preview')"
              @click="previewFile(file)"
            >
              <Icon name="eye" />
            </button>
            <button
              v-if="canRemove"
              type="button"
              :class="overlayIconButtonClass"
              :aria-label="T('remove')"
              @click="removeFile(file)"
            >
              <Icon name="trash-2" />
            </button>
          </div>
        </div>

        <button
          v-if="showTrigger"
          type="button"
          :class="boxTriggerClass"
          :disabled="disabled || reachedMax"
          @click="triggerSelect"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <Icon
            :name="iconName"
            class="size-5"
          />
          <span>{{ triggerLabel }}</span>
        </button>
      </div>

      <div
        v-else
        :class="emptyStateClass"
      >
        {{ T('empty') }}
      </div>

      <div
        v-if="showTrigger"
        class="mt-2 text-xs text-muted-foreground"
      >
        <slot
          name="hint"
          :lines="hintLines"
        >
          <div
            v-for="line in hintLines"
            :key="line"
          >
            {{ line }}
          </div>
        </slot>
      </div>
    </template>

    <p
      v-if="internalError"
      class="mt-2 text-sm text-danger"
    >
      {{ internalError }}
    </p>

    <!-- Image preview modal (box variant only) -->
    <Modal
      v-if="variant === 'box'"
      v-model:visible="previewVisible"
      hideHeader
      hideFooter
      :title="previewFileItem?.name"
      class="max-w-3xl"
    >
      <img
        v-if="previewFileItem?.url"
        :src="previewFileItem.url"
        :alt="previewFileItem.name"
        class="mx-auto max-h-[70vh] max-w-full object-contain"
      >
    </Modal>
  </div>
</template>

<style scoped>
@keyframes upload-progress-anim {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.upload-progress {
  width: 60%;
  animation: upload-progress-anim 1.2s ease-in-out infinite;
}
</style>
