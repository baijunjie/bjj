import type { Preview } from '@storybook-vue/nuxt'

const preview: Preview = {
  tags: [ 'autodocs' ],
  parameters: {
    options: {
      storySort: {
        order: [ 'Introduction' ],
      },
    },
  },
}

export default preview
