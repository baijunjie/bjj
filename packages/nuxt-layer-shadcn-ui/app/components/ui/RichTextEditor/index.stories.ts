import type { Meta, StoryObj } from '@storybook/vue3'
import EventLog from '#storybook/EventLog.vue'
import { useArgsModel } from '#storybook/argsModel'
import RichTextEditor from './index.vue'
import type { RichTextEditorTool, RichTextEditorUploadImage } from './types'
import { richTextEditorDefaultToolbar } from './types'

const sizes = [ 'xs', 'sm', 'md', 'default', 'lg' ] as const
const formats = [ 'html', 'markdown' ] as const

const sampleHtml = `
<h2>Release notes</h2>
<p>This release brings <strong>faster search</strong>, <em>smarter filters</em> and a refreshed <a href="https://example.com">settings page</a>.</p>
<ul>
  <li><p>Search results now load as you type</p></li>
  <li><p>Filters remember your last choice</p></li>
</ul>
<blockquote><p>Thanks to everyone who sent feedback.</p></blockquote>
`.trim()

const sampleMarkdown = `
## Release notes

This release brings **faster search**, *smarter filters* and a refreshed [settings page](https://example.com).

- Search results now load as you type
- Filters remember your last choice

> Thanks to everyone who sent feedback.
`.trim()

const basicToolbar: RichTextEditorTool[] = [ 'bold', 'italic', 'underline', '|', 'bulletList', 'orderedList', '|', 'link' ]

// Simulates a server upload: resolves with a local object URL after a short delay
const fakeUpload: RichTextEditorUploadImage = file => new Promise(resolve => {
  setTimeout(() => resolve(URL.createObjectURL(file)), 800)
})

const meta = {
  title: 'UI/RichTextEditor',
  component: RichTextEditor,
  argTypes: {
    modelValue: { control: 'text' },
    format: { control: 'select', options: formats },
    placeholder: { control: 'text' },
    toolbar: { control: 'object' },
    maxlength: { control: 'number' },
    showCount: { control: 'boolean' },
    minHeight: { control: 'text' },
    maxHeight: { control: 'text' },
    uploadImage: { control: false },
    size: { control: 'select', options: sizes },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    modelValue: '',
    format: 'html',
    placeholder: 'Write something...',
    toolbar: [ ...richTextEditorDefaultToolbar ],
    maxlength: undefined,
    showCount: false,
    minHeight: undefined,
    maxHeight: undefined,
    uploadImage: undefined,
    size: 'default',
    readonly: false,
    disabled: false,
    invalid: false,
    class: '',
  },
  render: args => {
    const onUpdate = useArgsModel()
    return {
      components: { RichTextEditor },
      setup: () => ({ args, onUpdate }),
      template: `
        <!-- format / maxlength are read when the editor is created: remount on change so Controls take effect -->
        <div class="max-w-2xl">
          <RichTextEditor :key="\`\${args.format}-\${args.maxlength}\`" v-bind="args" @update:modelValue="onUpdate" />
        </div>
      `,
    }
  },
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const WithContent: Story = {
  parameters: noControls,
  args: {
    modelValue: sampleHtml,
  },
}

export const MarkdownFormat: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <RichTextEditor v-model="markdown" format="markdown" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RichTextEditor },
    setup: () => ({ markdown: ref(sampleMarkdown) }),
    template: `
      <div class="max-w-2xl space-y-3">
        <RichTextEditor v-model="markdown" format="markdown" />
        <pre class="rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">{{ markdown }}</pre>
      </div>
    `,
  }),
}

export const CustomToolbar: Story = {
  parameters: noControls,
  args: {
    toolbar: basicToolbar,
  },
}

export const WithCount: Story = {
  parameters: noControls,
  args: {
    showCount: true,
    maxlength: 200,
  },
}

export const Heights: Story = {
  parameters: noControls,
  args: {
    modelValue: sampleHtml,
    minHeight: 80,
    maxHeight: 200,
  },
}

export const ImageUpload: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<script setup lang="ts">
const content = ref('')

// Upload the file and resolve with its URL; reject to cancel the insert
async function uploadImage (file: File) {
  const { url } = await api.upload(file)
  return url
}
</script>

<template>
  <RichTextEditor v-model="content" :uploadImage="uploadImage" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RichTextEditor },
    setup: () => ({ content: ref(''), fakeUpload }),
    template: `
      <div class="max-w-2xl">
        <RichTextEditor
          v-model="content"
          :uploadImage="fakeUpload"
          placeholder="Use the image tool, or paste / drop an image here"
        />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <RichTextEditor v-model="content" size="sm" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RichTextEditor },
    setup: () => ({ sizes, basicToolbar, content: ref('<p>Compact tiers shrink the toolbar and the text.</p>') }),
    template: `
      <div class="max-w-2xl space-y-4">
        <div v-for="s in sizes" :key="s" class="flex items-start gap-3">
          <span class="w-14 pt-2 text-sm text-muted-foreground">{{ s }}</span>
          <RichTextEditor v-model="content" :size="s" :toolbar="basicToolbar" :minHeight="60" class="w-96" />
        </div>
      </div>
    `,
  }),
}

export const Invalid: Story = {
  parameters: noControls,
  args: {
    invalid: true,
    modelValue: '<p>Invalid content</p>',
  },
}

export const Disabled: Story = {
  parameters: noControls,
  args: {
    disabled: true,
    modelValue: sampleHtml,
  },
}

export const Readonly: Story = {
  parameters: noControls,
  args: {
    readonly: true,
    modelValue: sampleHtml,
  },
}

export const EventHandling: Story = {
  parameters: noControls,
  render: () => ({
    components: { RichTextEditor, EventLog },
    setup: () => ({ content: ref(''), basicToolbar }),
    template: `
      <EventLog v-slot="{ record }">
        <div class="max-w-2xl">
          <RichTextEditor
            v-model="content"
            :toolbar="basicToolbar"
            placeholder="Type, then click outside to see events"
            @update:modelValue="(v) => record('update:modelValue', v)"
            @change="(v) => record('change', v)"
            @focus="record('focus')"
            @blur="record('blur')"
          />
        </div>
      </EventLog>
    `,
  }),
}
