import type { Preview } from '@storybook-vue/nuxt'

const preview: Preview = {
  tags: [ 'autodocs' ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'oklch(var(--background))' },
        { name: 'dark', value: 'dark' },
      ],
    },
    options: {
      storySort: {
        order: [ 'Introduction' ],
      },
    },
  },
  decorators: [
    (_story, context) => {
      const bg = context.globals.backgrounds?.value
      document.documentElement.classList.toggle('dark', bg === 'dark')
      return { template: '<story />' }
    },
  ],
}

export default preview
