import type { Options } from '../index'
import vue from 'eslint-plugin-vue'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'jsx',
    'tsx',
    'vue',
  ]
  let languageOptions
  if (scopes?.ts) {
    languageOptions = { parserOptions: { parser: typescript.parser }}
  }
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions,
      extends: [
        ...vue.configs['flat/strongly-recommended'],
      ],
      rules: {
        'vue/comma-dangle': [ 'error', 'always-multiline' ], // 尾行逗号检查
        'vue/quote-props': [ 'error', 'consistent-as-needed' ], // 在同一对象中，所有属性使用一致的引号
        'vue/no-unused-vars': 'error', // 未使用的变量是否有效的规则
        'vue/space-infix-ops': 'error', // Good: foo + bar | Bad: foo+bar // 单位与单位间需要空格
        'vue/block-spacing': 'error', // Good: { foo } | Bad: {foo} // 大括号间需要空格
        'vue/key-spacing': [ 'error', {
          beforeColon: false,
          afterColon: true,
        }], // Good: { foo: 'bar' } | Bad: { foo:'bar' } // 对象属性冒号前后空格规则
        'vue/keyword-spacing': [ 'error', { before: true }], // Good: if (foo) {} | Bad: if(foo) {} // 关键字前后空格规则
        'vue/arrow-spacing': [ 'error', {
          before: true,
          after: true,
        }], // Good: foo => bar | Bad: foo=>bar // 箭头(=>)左右空格规则
        'vue/comma-spacing': [ 'error', {
          before: false,
          after: true,
        }], // Good: foo, bar | Bad: foo , bar // 逗号前后空格规则
        'vue/func-call-spacing': [ 'error', 'never' ], // Good: foo() | Bad: foo () // 函数调用时，函数名和括号之间不允许空格
        'vue/template-curly-spacing': [ 'error', 'never' ], // Good: `${foo}` | Bad: `${ foo }` // 模板字符串中的空格规则
        'vue/array-bracket-spacing': [ 'error', 'always', {
          arraysInArrays: false,
          objectsInArrays: false,
        }], // Good: [ foo ] | Bad: [foo] // 数组左右括号空格规则
        'vue/object-curly-spacing': [ 'error', 'always', {
          arraysInObjects: false,
          objectsInObjects: false,
        }], // Good: { foo: 'bar' } | Bad: {foo: 'bar'} // 对象左右括号空格规则
        'vue/no-unused-components': 'error', // 未使用組件是否有效的规则
        'vue/no-v-html': 'off', // 允许使用 v-html
        'vue/v-bind-style': [ 'error', 'shorthand' ], // 强制 v-bind 使用 :
        'vue/v-on-style': [ 'error', 'shorthand' ], // 强制 v-on 使用 @
        'vue/this-in-template': [ 'error', 'never' ], // 模板中不允许出现 this
        'vue/attribute-hyphenation': [ 'error', 'never' ], // 使用组件时，属性名必须使用驼峰命名
        'vue/v-on-event-hyphenation': [ 'error', 'never' ], // 事件名必须使用驼峰命名
        'vue/html-closing-bracket-newline': [ 'error', {
          singleline: 'never', // 如果没有换行属性，标签右括号不允许换行
          multiline: 'always', // 如果有换行属性，标签右括号必须换行
        }],
        'vue/html-closing-bracket-spacing': [ 'error', {
          startTag: 'never', // 标签开始括号不允许空格
          endTag: 'never', // 标签结束括号不允许空格
          selfClosingTag: 'always', // 自关闭标签右括号前必须空格
        }],
        'vue/html-end-tags': 'error', // 不允许未闭合的标签
        'vue/html-indent': [ 'error', 2, { // html 缩进
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true, // 在多行情况下属性是否应与第一个属性垂直对齐的条件。
          ignores: [], // 忽略节点的选择器。
        }],
        'vue/script-indent': [ 'error', 2, { // script 缩进
          baseIndent: 0,
          switchCase: 1,
          ignores: [],
        }],
        'vue/html-quotes': [ 'error', 'double' ], // 属性值强制使用双引号
        'vue/html-self-closing': 'off', // 不强制自闭和标签
        'vue/max-attributes-per-line': [ 'error', { // 标签同一行属性允许数量
          singleline: 1,
          multiline: { max: 1 },
        }],
        'vue/singleline-html-element-content-newline': [ 'error', { // 元素内容单行时的规则
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: [ 'pre', 'textarea' ],
        }],
        'vue/multiline-html-element-content-newline': [ 'error', { // 元素内容多行时的规则
          ignoreWhenEmpty: true, // 在元素没有内容时禁用报告
          ignores: [ 'pre', 'textarea' ], // 忽略规则的元素
          allowEmptyLines: false, // 不允许内容周围有空行
        }],
        'vue/no-multi-spaces': [ 'error', { // 标签内属性名之前不允许多个空格
          ignoreProperties: true, // 忽略对象的属性
        }],
        'vue/mustache-interpolation-spacing': 'error', // 大括号内必须有空格
        'vue/multi-word-component-names': 'off', // vue 组件 name 中使用多个单词
        'vue/component-name-in-template-casing': 'error',
        'vue/prop-name-casing': [ 'error', 'camelCase' ], // 组件 prop 强制小驼峰命名
        'vue/require-default-prop': 'error', // 组件 prop 必须设置默认值，不包括 Boolean 值属性
        'vue/require-prop-types': 'error', // 组件 prop 必须指定类型
        'vue/require-explicit-emits': 'error', // 组件必须显式声明 emits
        'vue/no-spaces-around-equal-signs-in-attribute': 'error', // 标签中属性的等号两侧不允许空格
        'vue/no-template-shadow': 'error', // 子 v-for 中不允许覆盖父 v-for 中的变量
        'vue/block-order': [ 'error', { // 强制组件中的顺序
          order: [[ 'script', 'template' ], 'style' ],
        }],
        'vue/padding-line-between-blocks': 'error', // 强制组件中 template, script, style 之间用空行分割
        'vue/require-direct-export': 'error', // 规范组件的 export
        'vue/attributes-order': [ 'error', { // 标签内属性排序
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            [ 'UNIQUE', 'SLOT' ],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        }],
        'vue/order-in-components': [ 'error', { // 组件内属性排序
          order: [
            'name',
            'mixins',
            'components',
            'model',

            [ 'provide', 'inject' ],
            [ 'props', 'propsData' ],
            'data',
            'computed',
            'methods',

            'watch',
            'watchQuery',
            'LIFECYCLE_HOOKS',
          ],
        }],
        'vue/v-slot-style': 'error',
        'vue/no-deprecated-scope-attribute': 'error', // Disallow deprecated scope attribute (in Vue.js 2.5.0+)
        'vue/no-deprecated-slot-attribute': 'error', // Disallow deprecated slot attribute (in Vue.js 2.6.0+)
        'vue/no-deprecated-slot-scope-attribute': 'error', // Disallow deprecated slot-scope attribute (in Vue.js 2.6.0+)
      },
    },
  ]
}
