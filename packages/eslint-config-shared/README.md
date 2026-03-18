# @bjj/eslint-config-my

Eslint 共享配置

## 使用特点

### 1. 去除 Prettier，只用 Eslint，样式类 rule 使用 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)

### 2. 可配置式，动态引入 rule

### 3. 使用 eslint@9 的 [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## 使用

```ts
// eslint.config.ts
import myLint from '@bjj/eslint-config-my'

export default myLint()
```
