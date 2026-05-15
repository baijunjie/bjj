import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import type { UploadFile, UploadVariant } from './types'
import Upload from './index.vue'

const variants: UploadVariant[] = [ 'button', 'box', 'drag' ]

const sampleImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
const sampleImage2 = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'

const sampleImages: UploadFile[] = [
  { uid: 's-img-1', name: 'avatar.png', url: sampleImage, status: 'done' },
  { uid: 's-img-2', name: 'cover.png', url: sampleImage2, status: 'done' },
]

const meta = {
  title: 'UI/Upload',
  component: Upload,
  argTypes: {
    variant: { control: 'select', options: variants },
    accept: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    multiple: { control: 'boolean' },
    maxCount: { control: 'number' },
    maxSize: { control: 'number' },
    directory: { control: 'boolean' },
    text: { control: 'text' },
    icon: { control: 'text' },
  },
  args: {
    variant: 'button',
    accept: '',
    disabled: false,
    readonly: false,
    invalid: false,
    multiple: false,
    maxCount: undefined,
    maxSize: undefined,
    directory: false,
    text: '',
    icon: '',
  },
  // fileList carries `raw: File` after a user picks a file, which is not
  // structured-cloneable — Storybook's `updateArgs` drops such values, so
  // binding fileList through args makes uploads appear to do nothing. Use a
  // local ref instead, optionally seeded from `args.fileList`.
  render: args => ({
    components: { Upload },
    setup () {
      const initial = Array.isArray(args.fileList) ? args.fileList as UploadFile[] : []
      const fileList = ref<UploadFile[]>([ ...initial ])
      return { args, fileList }
    },
    template: `
      <div class="max-w-2xl">
        <Upload v-bind="args" v-model:fileList="fileList" />
      </div>
    `,
  }),
} satisfies Meta<typeof Upload>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

// --- Variant showcase ---

export const VariantButton: Story = {
  parameters: noControls,
  args: { variant: 'button' },
}

export const VariantBox: Story = {
  parameters: noControls,
  args: {
    variant: 'box',
    accept: 'image/*',
    multiple: true,
    maxCount: 5,
    fileList: sampleImages,
  },
}

export const VariantDrag: Story = {
  parameters: noControls,
  args: { variant: 'drag' },
}

export const AcceptImagesOnly: Story = {
  parameters: noControls,
  args: {
    variant: 'drag',
    accept: 'image/*',
    multiple: true,
  },
}

// --- Selection behavior (all three variants side by side) ---

export const Multiple: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload v-model:fileList="fileList" variant="drag" multiple />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup: () => ({ variants }),
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload v-for="v in variants" :key="v" :variant="v" multiple />
      </div>
    `,
  }),
}

export const MaxCount: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload v-model:fileList="fileList" variant="drag" multiple :maxCount="3" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup: () => ({ variants }),
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload v-for="v in variants" :key="v" :variant="v" multiple :maxCount="3" />
      </div>
    `,
  }),
}

export const MaxSize: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload v-model:fileList="fileList" variant="drag" multiple :maxSize="50 * 1024" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup: () => ({ variants }),
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload v-for="v in variants" :key="v" :variant="v" multiple :maxSize="50 * 1024" />
      </div>
    `,
  }),
}

export const Directory: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload
    v-model:fileList="fileList"
    variant="button"
    directory
    accept="image/*"
    :maxCount="5"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup: () => ({ variants }),
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload
          v-for="v in variants"
          :key="v"
          :variant="v"
          directory
          accept="image/*"
          :maxCount="5"
        />
      </div>
    `,
  }),
}

// --- States ---

export const Disabled: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload v-model:fileList="fileList" variant="drag" disabled multiple />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup () {
      const fileList = ref<UploadFile[]>([ ...sampleImages ])
      return { variants, fileList }
    },
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload
          v-for="v in variants"
          :key="v"
          :variant="v"
          disabled
          multiple
          :fileList="fileList"
        />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload v-model:fileList="fileList" variant="drag" readonly multiple />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup () {
      const fileList = ref<UploadFile[]>([ ...sampleImages ])
      return { variants, fileList }
    },
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload
          v-for="v in variants"
          :key="v"
          :variant="v"
          readonly
          multiple
          :fileList="fileList"
        />
      </div>
    `,
  }),
}

export const ReadonlyEmpty: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload variant="drag" readonly />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup: () => ({ variants }),
    template: `
      <div class="max-w-2xl space-y-6">
        <Upload v-for="v in variants" :key="v" :variant="v" readonly />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    variant: 'drag',
    invalid: true,
    multiple: true,
    fileList: [
      { uid: 'i-1', name: 'gitmoji (1).md', status: 'done' },
      { uid: 'i-2', name: 'cd973fbf55b88a9ebaec4f01821c552a.png', status: 'done' },
    ],
  },
}

// --- Custom behaviors ---

export const BeforeUpload: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload
    v-model:fileList="fileList"
    variant="drag"
    multiple
    :beforeUpload="beforeUpload"
  />
</template>

<script setup lang="ts">
const fileList = ref<UploadFile[]>([])

function beforeUpload (file: File) {
  // Reject files larger than 1MB
  if (file.size > 1024 * 1024) {
    alert(\`\${file.name} is too large (>1MB)\`)
    return false
  }
  // Optionally return a Promise<File | Blob> to replace the file
  return true
}
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup () {
      const fileList = ref<UploadFile[]>([])
      function beforeUpload (file: File) {
        if (file.size > 1024 * 1024) {
          alert(`${file.name} is too large (>1MB)`)
          return false
        }
        return true
      }
      return { fileList, beforeUpload }
    },
    template: `
      <div class="max-w-2xl">
        <Upload
          v-model:fileList="fileList"
          variant="drag"
          multiple
          :beforeUpload="beforeUpload"
        />
      </div>
    `,
  }),
}

export const CustomUpload: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload
    v-model:fileList="fileList"
    variant="box"
    accept="image/*"
    multiple
    :maxCount="5"
    :upload="upload"
  />
</template>

<script setup lang="ts">
const fileList = ref<UploadFile[]>([])

async function upload (files: (File | Blob)[]) {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500))
  // throw new Error('Upload failed') would mark items as error
}
</script>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    setup () {
      const fileList = ref<UploadFile[]>([])
      async function upload () {
        await new Promise<void>(resolve => setTimeout(resolve, 1500))
      }
      return { fileList, upload }
    },
    template: `
      <div class="max-w-2xl">
        <Upload
          v-model:fileList="fileList"
          variant="box"
          accept="image/*"
          multiple
          :maxCount="5"
          :upload="upload"
        />
      </div>
    `,
  }),
}

export const CustomHint: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload variant="drag" multiple accept="image/*" :maxSize="50 * 1024">
    <template #hint="{ lines }">
      <ul class="list-disc pl-5 text-primary inline-block text-left">
        <li v-for="line in lines" :key="line">{{ line }}</li>
      </ul>
    </template>
  </Upload>
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload },
    template: `
      <div class="max-w-2xl">
        <Upload variant="drag" multiple accept="image/*" :maxSize="50 * 1024">
          <template #hint="{ lines }">
            <ul class="list-disc pl-5 text-primary inline-block text-left">
              <li v-for="line in lines" :key="line">{{ line }}</li>
            </ul>
          </template>
        </Upload>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <Upload
    v-model:fileList="fileList"
    variant="drag"
    multiple
    @update:fileList="onUpdate"
    @change="onChange"
    @remove="onRemove"
    @preview="onPreview"
    @error="onError"
  />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { Upload, EventLog },
    setup: () => ({ fileList: ref<UploadFile[]>([]) }),
    template: `
      <EventLog v-slot="{ record }">
        <Upload
          v-model:fileList="fileList"
          variant="drag"
          multiple
          @update:fileList="(v) => record('update:fileList', v.map(f => f.name))"
          @change="(v) => record('change', v.map(f => f.name))"
          @remove="(f) => record('remove', f.name)"
          @preview="(f) => record('preview', f.name)"
          @error="(e) => record('error', String(e))"
        />
      </EventLog>
    `,
  }),
}
