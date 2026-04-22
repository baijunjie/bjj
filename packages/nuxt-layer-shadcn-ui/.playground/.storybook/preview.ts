import type { Preview } from '@storybook-vue/nuxt'

const preview: Preview = {
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
