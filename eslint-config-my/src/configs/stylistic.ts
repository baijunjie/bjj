import type { Options } from '../index'
import stylistic from '@stylistic/eslint-plugin'
import typescript from 'typescript-eslint'

export default function (scopes: Options['scopes']) {
  const extensions = [
    'js',
    'cjs',
    'mjs',
    'ts',
    'cts',
    'mts',
    'html',
  ]
  if (scopes?.react) {
    extensions.push('jsx', 'tsx')
  }
  if (scopes?.vue) {
    extensions.push('vue', 'jsx', 'tsx')
  }
  let languageOptions
  if (scopes?.ts) {
    languageOptions = {
      parserOptions: { parser: typescript.parser },
    }
  }
  return [
    {
      files: [ `**/*.{${extensions.join(',')}}` ],
      languageOptions,
      extends: [
        stylistic.configs['recommended'],
      ],
      rules: {
        '@stylistic/template-tag-spacing': 'error', // Good: foo`bar` | Bad: foo `bar` // 模板字符串标签函数调用时，标签和模板字符串之间不允许空格
        '@stylistic/brace-style': [ 'error', '1tbs' ], // Good: if (foo) { bar() } | Bad: if (foo) {bar()} // 大括号风格
        '@stylistic/arrow-parens': [ 'error', 'as-needed' ], // Good: foo => bar | Bad: foo => (bar) // 箭头函数参数括号规则
        '@stylistic/comma-dangle': [ 'error', 'always-multiline' ], // 尾行逗号检查
        '@stylistic/space-infix-ops': 'error', // Good: foo + bar | Bad: foo+bar // 单位与单位间需要空格
        '@stylistic/block-spacing': 'error', // Good: { foo } | Bad: {foo} // 大括号间需要空格
        '@stylistic/key-spacing': [ 'error', {
          beforeColon: false,
          afterColon: true,
        }], // Good: { foo: 'bar' } | Bad: { foo:'bar' } // 对象属性冒号前后空格规则
        '@stylistic/keyword-spacing': [ 'error', { before: true }], // Good: if (foo) {} | Bad: if(foo) {} // 关键字前后空格规则
        '@stylistic/arrow-spacing': [ 'error', {
          before: true,
          after: true,
        }], // Good: foo => bar | Bad: foo=>bar // 箭头(=>)左右空格规则
        '@stylistic/comma-spacing': [ 'error', {
          before: false,
          after: true,
        }], // Good: foo, bar | Bad: foo , bar // 逗号前后空格规则
        '@stylistic/function-call-spacing': [ 'error', 'never' ], // Good: foo() | Bad: foo () // 函数调用时，函数名和括号之间不允许空格
        '@stylistic/template-curly-spacing': [ 'error', 'never' ], // Good: `${foo}` | Bad: `${ foo }` // 模板字符串中的空格规则
        '@stylistic/array-bracket-spacing': [ 'error', 'always', {
          arraysInArrays: false,
          objectsInArrays: false,
        }], // Good: [ foo ] | Bad: [foo] // 数组左右括号空格规则
        '@stylistic/object-curly-spacing': [ 'error', 'always', {
          arraysInObjects: false,
          objectsInObjects: false,
        }], // Good: { foo: 'bar' } | Bad: {foo: 'bar'} // 对象左右括号空格规则
        '@stylistic/switch-colon-spacing': 'error', // Good: case 'bar': | Bad: case 'bar' : // switch 语句中冒号前后不允许空格
        '@stylistic/semi': [ 'error', 'never' ], // Good: foo() | Bad: foo(); // 语句末尾不允许分号
        '@stylistic/semi-spacing': 'error', // Good: foo(); | Bad: foo() ;
        '@stylistic/rest-spread-spacing': [ 'error', 'never' ], // Good: [...foo] | Bad: [ ... foo ]
        '@stylistic/computed-property-spacing': [ 'error', 'never' ], // Good: obj[foo] | Bad: obj[ foo ]
        '@stylistic/quotes': [ 'error', 'single' ], // Good: 'foo' | Bad: "foo"
        '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ], // Good: { foo: 'bar' } | Bad: { 'foo': 'bar' } // 在同一对象中，所有属性使用一致的引号
        '@stylistic/space-before-function-paren': [ 'error', 'always' ], // Good: function foo () {} | Bad: function foo() {}
        '@stylistic/indent': [ 'error', 2, {
          SwitchCase: 1,
          ignoredNodes: [ 'TemplateLiteral' ], // see https://github.com/babel/babel-eslint/issues/681#issuecomment-451336031
        }], // 缩进规则
      },
    },
  ]
}
