---
name: styling
description: 样式开发规范。在编写 CSS/Tailwind 样式、处理 Dark Mode、设置背景色/文本色/边框色、封装组件的 type 配色（default/success/info/help/warn/danger）时使用。
---

# 样式开发指南

本包基于 [shadcn-vue 主题规范](https://www.shadcn-vue.com/themes)，采用**调色板 → 语义映射**两层架构。调色板变量定义在 `app/assets/styles/colors.css`（oklch 格式），通过 `@theme inline` 映射为 Tailwind 语义类。

全局入口：`app/assets/styles/globals.css`（由 `nuxt.config.ts` 的 `css` 数组注册）。

---

## Dark Mode

通过 `<html>` 的 `.dark` class 切换，Tailwind v4 配置：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

本层不提供 dark-mode 切换器——消费方负责触发 class（或者用 `@bjj/nuxt-layer-shadcn-ui` 的 `DarkModeSwitcher` 作参考）。

---

## 颜色架构

### 两层设计

```
colors.css                       @theme inline                   使用方式
──────────────                   ──────────────                  ──────────
调色板变量（定义实际色值）     →   语义变量（映射到调色板）      →   Tailwind class / var(--color-*)
--background                     --color-background              bg-background
--background-muted               --color-muted                   bg-muted
--foreground-muted               --color-muted-foreground        text-muted-foreground
```

### ⛔ CSS 变量使用规范

在自定义 CSS 中引用颜色时，**必须使用 `--color-*` 语义变量**，禁止直接引用调色板变量：

```css
/* ❌ 禁止：直接引用调色板变量 */
color: var(--foreground);
background: var(--background-muted);

/* ✅ 正确：使用 @theme inline 注册的语义变量 */
color: var(--color-foreground);
background: var(--color-muted);
```

> **原因**：调色板变量是底层实现，语义变量是对外接口。调色板可能被重构，语义变量保持稳定。

---

## 调色板变量一览

> 仅供了解映射关系，不直接在组件中引用。

### Background — 4 级色阶

| 变量 | 语义 | 映射的语义类 |
|------|------|---|
| `--background` | 页面底色 / 侧边栏 | `bg-background` / `bg-sidebar` |
| `--background-surface` | 卡片、panel、modal、popover、dropdown | `bg-card` / `bg-popover` |
| `--background-muted` | 去强调区域 / secondary | `bg-muted` / `bg-secondary` |
| `--background-accent` | hover / 交互高亮 | `bg-accent` / `bg-sidebar-accent` |

### Foreground — 3 级色阶

| 变量 | 语义 |
|------|------|
| `--foreground` | 主要文本 |
| `--foreground-muted` | 次要/弱化文本 |
| `--foreground-accent` | 交互态文本 |

### Brand / Border / Status

| 变量 | 说明 |
|------|------|
| `--primary` / `--primary-foreground` | 品牌主色及其上的文字色 |
| `--border` / `--ring` | 边框色 / 焦点环色 |
| `--status-foreground` | 语义状态色的统一前景色 |
| `--success` / `--info` / `--help` / `--warn` / `--danger` | 5 种语义状态色 |

---

## 语义颜色（Tailwind class）

> 以下为组件中实际使用的颜色。

### Base — 页面背景/前景

| 场景 | 推荐类 |
|------|--------|
| 页面背景 | `bg-background` |
| 主要文本 | `text-foreground` |

### Components — 容器组件

| 场景 | 推荐类 |
|------|--------|
| 卡片/面板 | `bg-card` / `text-card-foreground` |
| 弹出层 | `bg-popover` / `text-popover-foreground` |

### Brand — 品牌色

| 场景 | 推荐类 |
|------|--------|
| 主题色按钮/高亮 | `bg-primary` / `text-primary-foreground` |
| 次要按钮 | `bg-secondary` / `text-secondary-foreground` |

### State — 状态色

| 场景 | 推荐类 |
|------|--------|
| 弱化/禁用区域 | `bg-muted` / `text-muted-foreground` |
| hover / 交互反馈 | `bg-accent` / `text-accent-foreground` |
| 危险操作 | `bg-danger` / `text-danger` |

### Form & Border — 表单/边框

| 场景 | 推荐类 |
|------|--------|
| 通用边框 | `border-border` |
| 输入框边框 | `border-input` |
| 焦点环 | `ring-ring` / `ring-offset-background` |

### Sidebar — 侧边栏

| 场景 | 推荐类 |
|------|--------|
| 侧边栏背景 | `bg-sidebar` / `text-sidebar-foreground` |
| 侧边栏主色 | `bg-sidebar-primary` / `text-sidebar-primary-foreground` |
| 侧边栏交互 | `bg-sidebar-accent` / `text-sidebar-accent-foreground` |
| 侧边栏边框 | `border-sidebar-border` |
| 侧边栏焦点环 | `ring-sidebar-ring` |

### Semantic status — 语义状态色（项目扩展）

5 种状态颜色，遵循 `background + foreground` 配对：

| 语义 | 背景 + 前景 | 文本色 | 边框色 |
|------|------------|--------|--------|
| success | `bg-success` + `text-success-foreground` | `text-success` | `border-success` |
| info | `bg-info` + `text-info-foreground` | `text-info` | `border-info` |
| help | `bg-help` + `text-help-foreground` | `text-help` | `border-help` |
| warn | `bg-warn` + `text-warn-foreground` | `text-warn` | `border-warn` |
| danger | `bg-danger` + `text-danger-foreground` | `text-danger` | `border-danger` |

浅色背景用透明度：`bg-success/10 text-success`

---

## 组件配色类型约定

封装组件的 `type` prop（`default | success | info | help | warn | danger`）对应配色方案时，**`default` 必须使用语义化的 `secondary` 色，禁止使用 `primary`**。`primary` 仅保留给主题主色按钮和高亮场景。

### 默认 `default` 映射

| variant | 推荐类 |
|---------|--------|
| `flat`（仅填充） | `bg-secondary text-secondary-foreground` |
| `soft`（填充 + 边框） | `bg-secondary text-secondary-foreground border-border` |
| `bordered`（仅边框） | `border-border text-foreground` |
| `solid`（高对比填充） | `bg-accent text-accent-foreground` |

### 与语义状态色对照

以 `soft` variant 为例，带色 type 统一使用 `/10` 背景 + 实色文字 + `/50` 边框：

| type | 示例类 |
|------|--------|
| default | `bg-secondary text-secondary-foreground border-border` |
| success | `bg-success/10 text-success border-success/50` |
| info | `bg-info/10 text-info border-info/50` |
| help | `bg-help/10 text-help border-help/50` |
| warn | `bg-warn/10 text-warn border-warn/50` |
| danger | `bg-danger/10 text-danger border-danger/50` |

> 参考实现：`app/components/ui/Alert`、`app/components/ui/Tag`、`app/components/ui/Surface`。

---

## 透明度

```html
<div class="bg-primary/50">50% 透明度</div>
```

---

## 样式文件加载

`app/assets/styles/globals.css` 是总入口，依次 `@import`：
- `tailwindcss`
- `tw-animate-css`
- `./colors.css`
- `./utilities.css`
- `./animate.css`
- `./transition.css`

修改色值 → `colors.css`；新增 utility → `utilities.css`；动画 → `animate.css`。

`nuxt.config.ts` 通过 `css: [...]` 注册 globals.css，消费方 `extends` 本 layer 时自动继承。

---

## 检查清单

- [ ] 组件中不直接引用调色板变量（`--foreground` 等），只用 `--color-*` 语义变量
- [ ] `type` prop 仅用 6 种合法值（`default`/`success`/`info`/`help`/`warn`/`danger`）
- [ ] `default` type 映射到 `secondary` 色系，不用 `primary`
- [ ] Dark mode 样式通过 `dark:` 前缀处理，不硬编码 HTML `.dark` 判断
- [ ] 新颜色值加到 `colors.css` 并在 `@theme inline` 中声明语义名