import type { Meta, StoryObj } from '@storybook/vue3'
import Markdown from './index.vue'

const meta = {
  title: 'UI/Markdown',
  component: Markdown,
  argTypes: {
    hideTitle: { control: 'boolean' },
  },
  args: {
    hideTitle: false,
  },
  render: args => ({
    components: { Markdown },
    setup: () => ({ args }),
    template: `
      <Markdown v-bind="args">
        <h1>Document Title</h1>
        <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <h2>Lists</h2>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item with <a href="#">a link</a></li>
        </ul>
        <h2>Code</h2>
        <pre><code>const greeting = 'Hello, world!'
console.log(greeting)</code></pre>
        <h2>Blockquote</h2>
        <blockquote><p>This is a blockquote with some important information.</p></blockquote>
        <h2>Table</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Alpha</td><td>Active</td></tr>
            <tr><td>Beta</td><td>Inactive</td></tr>
          </tbody>
        </table>
      </Markdown>
    `,
  }),
} satisfies Meta<typeof Markdown>

export default meta
type Story = StoryObj<typeof meta>

const noControls = { controls: { disable: true }} satisfies Story['parameters']

export const Default: Story = {}

export const HideTitle: Story = {
  parameters: noControls,
  args: {
    hideTitle: true,
  },
}
