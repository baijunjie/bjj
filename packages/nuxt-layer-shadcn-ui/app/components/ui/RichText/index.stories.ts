import type { Meta, StoryObj } from '@storybook/vue3'
import RichTextEditor from '../RichTextEditor/index.vue'
import RichText from './index.vue'

const formats = [ 'html', 'markdown' ] as const

const sampleHtml = `
<h2>Release notes</h2>
<p>This release brings <strong>faster search</strong>, <em>smarter filters</em> and a refreshed <a href="https://example.com">settings page</a>.</p>
<ul>
  <li><p>Search results now load as you type</p></li>
  <li><p>Filters remember your last choice</p></li>
</ul>
<p style="text-align: center"><u>Centered and underlined</u></p>
<blockquote><p>Thanks to everyone who sent feedback.</p></blockquote>
<pre><code>pnpm add @bjj/nuxt-layer-shadcn-ui</code></pre>
`.trim()

const sampleMarkdown = `
## Release notes

This release brings **faster search**, *smarter filters* and a refreshed [settings page](https://example.com).

1. Search results now load as you type
2. Filters remember your last choice

> Thanks to everyone who sent feedback.

\`\`\`
pnpm add @bjj/nuxt-layer-shadcn-ui
\`\`\`
`.trim()

const meta = {
  title: 'UI/RichText',
  component: RichText,
  parameters: {
    docs: {
      description: {
        component: 'Shows content written in RichTextEditor (HTML or Markdown) with the editor\'s typography — sanitized and rendered in the browser only, so it is safe for user-generated content. For trusted, already-rendered HTML such as docs, use **Markdown**.',
      },
    },
  },
  argTypes: {
    content: { control: 'text' },
    format: { control: 'select', options: formats },
    class: { control: 'text' },
  },
  args: {
    content: sampleHtml,
    format: 'html',
    class: '',
  },
  render: args => ({
    components: { RichText },
    setup: () => ({ args }),
    template: '<RichText v-bind="args" class="max-w-2xl" />',
  }),
} satisfies Meta<typeof RichText>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const MarkdownFormat: Story = {
  parameters: noControls,
  args: {
    content: sampleMarkdown,
    format: 'markdown',
  },
}

export const CustomClass: Story = {
  parameters: noControls,
  args: {
    class: 'text-sm text-muted-foreground',
  },
}

export const WithEditor: Story = {
  parameters: {
    ...noControls,
    docs: {
      source: {
        code: `
<template>
  <RichTextEditor v-model="content" />
  <RichText :content="content" />
</template>
`.trim(),
      },
    },
  },
  render: () => ({
    components: { RichText, RichTextEditor },
    setup: () => ({ content: ref(sampleHtml) }),
    template: `
      <div class="grid max-w-5xl gap-6 md:grid-cols-2">
        <RichTextEditor v-model="content" />
        <RichText :content="content" class="rounded-md border p-4" />
      </div>
    `,
  }),
}
