module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-lone-blocks': 'off',
    'template-tag-spacing': 'error',
    'switch-colon-spacing': 'error',
    'semi': [ 'error', 'never' ],
    'semi-spacing': 'error',
    'quotes': [ 'error', 'single' ],
    'no-unused-expressions': [ 'error', { // 未使用表达式是否有效的规则
      allowShortCircuit: true,
      allowTernary: true
    }],
    'rest-spread-spacing': [ 'error', 'never' ],
    'computed-property-spacing': [ 'error', 'never' ],
    'space-before-function-paren': [ 'error', 'always' ], // 定义 function 括号前必需加空格
    'indent': [ 'error', 2, {
      SwitchCase: 1,
      ignoredNodes: [ 'TemplateLiteral' ] // see https://github.com/babel/babel-eslint/issues/681#issuecomment-451336031
    }],
    'comma-dangle': 'off', // 尾行逗号检查
    'block-spacing': 'error',
    'quote-props': [ 'error', 'consistent-as-needed' ], // 在同一对象中，所有属性使用一致的引号
    'no-unused-vars': 'error', // 未使用的变量是否有效的规则
    'space-infix-ops': 'error', // 单位与单位间需要空格
    'key-spacing': [ 'error', {
      beforeColon: false,
      afterColon: true,
    }],
    'keyword-spacing': [ 'error', { before: true }],
    'arrow-spacing': [ 'error', { // 箭头(=>)左右空格规则
      before: true,
      after: true
    }],
    'comma-spacing': [ 'error', { // 逗号前后空格规则
      before: false,
      after: true
    }],
    'func-call-spacing': [ 'error', 'never' ],
    'template-curly-spacing': [ 'error', 'never' ], // 模版字符串中的空格规则
    'array-bracket-spacing': [ 'error', 'always', { // 数组左右括号空格规则
      arraysInArrays: false,
      objectsInArrays: false
    }],
    'object-curly-spacing': [ 'error', 'always', { // 对象左右括号空格规则
      arraysInObjects: false,
      objectsInObjects: false
    }],
  }
}
