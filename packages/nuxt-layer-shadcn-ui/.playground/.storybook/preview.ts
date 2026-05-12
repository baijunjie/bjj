import type { Preview } from '@storybook-vue/nuxt'
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks'
import { createElement, Fragment } from 'react'

const preview: Preview = {
  tags: [ 'autodocs' ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Override the autodocs page so the Primary story is not duplicated in the Stories section.
      // `<Stories includePrimary={false}>` skips the first story (which is rendered above as <Primary />).
      page: () => createElement(Fragment, null,
        createElement(Title),
        createElement(Subtitle),
        createElement(Description),
        createElement(Primary),
        createElement(Controls),
        createElement(Stories, { includePrimary: false }),
      ),
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
