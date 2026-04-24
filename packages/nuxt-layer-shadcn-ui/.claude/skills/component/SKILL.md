---
name: component
description: Vue 组件开发规范。**创建或修改任何 .vue 文件前必须调用**。包含组件层级（shadcn 基础层 / ui 封装层）、Props 透传、类型导出（types.ts）、v-model、Slots、i18n 就近文案、shadcn CLI 使用等规范。
---

# 组件开发指南

本项目是一个独立的 Nuxt Layer（`@bjj/nuxt-layer-shadcn-ui`），提供基于 shadcn-vue 的 UI 组件。消费方以 Nuxt layer 形式 `extends` 本包使用。

---

## ⛔ 组件层级

```
reka-ui / lucide-vue-next  →  app/components/shadcn/*  →  app/components/ui/*
     禁止跨层使用              shadcn CLI 产物（禁改）    ↗  封装层（对外 API）
```

| 层级 | 目录 | 可使用的来源 |
|------|------|---|
| shadcn 基础层 | `app/components/shadcn/` | reka-ui、lucide-vue-next |
| 封装层（对外） | `app/components/ui/` | `app/components/shadcn/*`、lucide、原生 HTML |

> - **`app/components/shadcn/` 由 `pnpm shadcn:add` 生成，任何样式/行为定制必须在 `ui/` 封装层完成**
> - 禁止修改 shadcn 文件；要变更路径/alias 只能改 `components.json` + 重新 `shadcn:add`
> - 本包对外的公开 API 只是 `app/components/ui/*`，shadcn 层视作内部实现

---

## 目录结构

```
app/
├── assets/styles/          # 全局样式（入口 globals.css）
├── components/
│   ├── shadcn/             # CLI 产物（禁改、不自动导入）
│   └── ui/                 # 封装层（无前缀自动导入）
├── composables/            # 本层 composable + re-export from @bjj/shared
├── types/                  # 全局类型（如 ClassValue）
└── utils/                  # 本层工具 + re-export（shadcn CLI 的 utils alias）
```

### 自动导入

`app/components/ui/` 下组件无前缀自动导入（`<Button />`、`<Tabs />` 等），其余目录默认带前缀。`app/components/shadcn/` 明确 ignore，不会被自动注册。

### 文件结构

| 类型 | 结构 |
|---|---|
| 简单封装 | `app/components/ui/Xxx/index.vue`（目录形式，保留类型扩展空间） |
| 带对外类型 | `Xxx/index.vue` + `Xxx/types.ts` |
| 带 i18n | `Xxx/index.vue` + `Xxx/en.json` |

**`app/components/ui/` 下每个组件都必须带 `index.stories.ts`**。详见"Storybook 维护"一节。

---

## Props 透传

### 核心问题

Vue 对 `defineProps` 中的可选布尔属性会默认为 `false` 而非 `undefined`，层层封装时导致问题。

### 解决方案：`/* @vue-ignore */`

继承第三方 Props 类型时，让 Vue 编译器忽略：被忽略的属性不会进入 `defineProps`，自动透过 `$attrs` 传下去。

```ts
// Xxx/types.ts
import type { BaseButtonProps } from 'reka-ui'

export interface XxxProps extends /* @vue-ignore */ BaseButtonProps {
  // 只在此处声明组件内部需要读取的属性
  icon?: string
}
```

### 根节点 vs 非根节点

| 场景 | 处理 |
|---|---|
| 第三方组件为根节点 | `$attrs` 自动继承，无需 `defineOptions` |
| 第三方组件非根节点 | `defineOptions({ inheritAttrs: false })` + 手动 `v-bind="$attrs"`（放最后以覆盖默认值） |

```vue
<!-- 非根节点 -->
<script setup lang="ts">
import type { XxxProps } from './types'
defineOptions({ inheritAttrs: false })
defineProps<XxxProps>()
</script>

<template>
  <div class="wrapper">
    <BaseInput :min="0" v-bind="$attrs" />
    <button>Clear</button>
  </div>
</template>
```

### Props 访问

- `<script>` 里用 `props.xxx`（必须有 `const props = defineProps<...>()`）
- `<template>` 里省略 `props.` 前缀
- **禁止**使用 `useAttrs()`、`useSlots()`（无响应性）

---

## 类型导出

### 核心规则

- **`.vue` 文件禁止 `export` 任何类型**
- **`app/components/ui/` 下所有组件的 `Props` 必须放入 `types.ts` 并 `export`**（封装层对外契约）
- `defineProps<T>()` / `defineEmits<T>()` / `defineModel<T>()` 的类型必须**显式 `import type`**，不能依赖 auto-import（Vue SFC 编译器不认 ambient 全局声明）

```vue
<!-- ✅ 正确 -->
<script setup lang="ts">
import type { ButtonProps } from './types'
defineProps<ButtonProps>()
</script>
```

### 自动导入

`app/components/**/types.ts` 中导出的类型通过 `nuxt.config.ts` 的 `imports:extend` hook 注册为**全局自动导入**。其他文件引用时无需显式 import（但 `defineProps` 的参数类型仍需显式 import，见上）。

### 命名规范

**所有在 `types.ts` 中导出的类型必须以组件名为前缀**。

- Props 统一为 `<Component>Props`、Emits 为 `<Component>Emits`
- 目录名复数的组件（`Tabs/`）前缀也用复数形式（`TabsItem`、`TabsProps`）
- 例：`DataTableColumn`、`DropdownItem`、`RadioCardGroupOption`

### `ClassValue`

通过 `app/types/css.ts` 以 `export type { ClassValue } from 'vue'` 声明为全局类型，可直接使用无需 import。

---

## v-model 双向绑定

### 禁止使用 `defineModel`

`defineModel` 创建本地 ref，赋值会立即改变并影响下游，父组件无法拦截验证，不符合单向数据流。

### 纯透传

组件不需要处理 `modelValue` 时让它通过 `$attrs` 透传——**不声明** `modelValue` prop。

### 内部处理

需要读取或修改 `modelValue` 时：`defineProps` + `defineEmits` + `computed` get/set。

```vue
<script setup lang="ts">
import type { XxxProps } from './types'
const props = defineProps<XxxProps>()
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined] }>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
```

---

## Slots 透传

| 场景 | 处理方式 |
|---|---|
| 单 slot 组件 | 直接 `<slot />` |
| 多 slots 组件 | 动态透传 |

```vue
<template>
  <!-- 多 slots：动态透传 -->
  <BaseComponent>
    <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </BaseComponent>
</template>
```

---

## Class 处理

### 有默认 class — 声明 + `cn()` 合并

```ts
// Xxx/types.ts
export interface XxxProps {
  class?: ClassValue
}
```

```vue
<script setup lang="ts">
import type { XxxProps } from './types'
const props = defineProps<XxxProps>()
const mergedClass = computed(() => cn('base default', props.class))
</script>

<template>
  <Base :class="mergedClass"><slot /></Base>
</template>
```

`cn` 来自 `app/utils/index.ts` 的 barrel re-export（映射到 `@bjj/shared/vue/utils`），自动全局可用。

### 无默认 class — 不声明

不要声明 `class` 属性再做无意义的 `cn(props.class)`。让它通过 `$attrs` 自然透传即可。

---

## 配色属性规范

具体的语义配色取值和 Tailwind 映射见 `styling` skill。

属性命名判断：

- **`color`** — 属性只控制颜色
- **`type`** — 属性同时还控制其它样式差异（比如 icon、排版等）

---

## 依赖 & 自动导入来源

### 来自 `@bjj/shared`（通过 barrel re-export）

- `app/utils/index.ts` → `cn`、`safeHtml`、`isUrl`、`formatCurrency`
- `app/composables/index.ts` → `useScrollState`、`useDevice`、`usePagination`、`useTranslations`、`useDate`

需要新 shared 符号时，**扩充对应 barrel 文件**，不要让消费端直接 import `@bjj/shared/*`。

### 本层自有

- `app/composables/useDialog.ts` — 与 `AlertDialog` 配对
- `app/composables/useToast.ts` — 与 `Toast` 配对

### 显式引用外部包

直接 `import { X } from 'reka-ui'` 等第三方包，但**只允许 shadcn 层**（`app/components/shadcn/*`）这样做。封装层只能用 shadcn 层。

---

## i18n

### 文案就近维护

每个组件的 i18n 文案放在同目录的 `en.json`（默认语言）。命名空间由目录路径自动生成：

| 组件路径 | 命名空间 |
|---|---|
| `app/components/ui/Select/en.json` | `components.ui.Select` |
| `app/components/ui/DataTable/en.json` | `components.ui.DataTable` |

```vue
<script setup lang="ts">
const T = useTranslations('components.ui.Select')
</script>
<template>
  <span>{{ T('placeholder') }}</span>
</template>
```

### 禁止硬编码

组件中任何用户可见的文本必须走 `T()`。

### 构建与检查

| 命令 | 作用 |
|---|---|
| `pnpm i18n:build` | 合并所有就近 `en.json` → `i18n/messages/en.json` |
| `pnpm i18n:check:undefined` | 检查使用但未定义的 key |
| `pnpm i18n:check:unused` | 检查定义但未使用的 key |
| `pnpm i18n:fix:alignment` | 对齐所有语言文件的 key 结构到 en |

`prepublishOnly` 自动跑 `i18n:build`，确保发布产物里的 `i18n/messages/` 是最新的。

---

## shadcn 组件管理

新增和更新都用同一个命令（会提示覆盖）：

```bash
pnpm shadcn:add <component-name>
```

读取 `components.json` 的 aliases，生成到 `app/components/shadcn/`。`utils` alias 指向 `app/utils/index.ts`，内部 re-export `cn` 给 shadcn 使用；自引用解析由 `nuxt.config.ts` 的 Vite `alias` 处理（pnpm 不为包自身建 symlink）。

---

## Storybook 维护

`app/components/ui/*` 的 `index.stories.ts` 是组件对外契约的活文档，和组件本身一起维护：

- 新建组件 → 同步建 stories
- 改 Prop / slot / 默认值 → 同步改 `argTypes`、`args` 和对应演示
- 删组件 → 一起删

具体 stories 写法（meta 结构、命名、Playground 放末尾等）见 `storybook` skill。