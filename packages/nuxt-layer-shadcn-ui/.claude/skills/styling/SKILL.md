---
name: styling
description: 样式开发规范。在编写 CSS/Tailwind 样式、处理 Dark Mode、设置背景色/文本色/边框色、封装组件的语义配色属性（`color` / `type`）时使用。
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

分两条轴：**抬升轴**（底面 → 抬升面）负责元素的层级/高度，**交互轴**（muted / accent）负责去强调或 hover/active 等交互态。两者独立，不共享前后关系。

| 轴 | 变量 | 语义 | 映射的语义类 |
|---|------|------|---|
| 抬升轴 | `--background` | 底面：页面底色 / 侧边栏 | `bg-background` / `bg-sidebar` |
| 抬升轴 | `--background-surface` | 抬升面：卡片、panel、modal、popover、dropdown | `bg-card` / `bg-popover` |
| 交互轴 | `--background-muted` | 去强调区域 / secondary | `bg-muted` / `bg-secondary` |
| 交互轴 | `--background-accent` | hover / 交互高亮 | `bg-accent` / `bg-sidebar-accent` |

> **注意**：dark 模式下 `--background-muted` 与 `--background-accent` 的亮度可能**高于** `--background-surface`（底色偏黑，交互色只能往亮处叠）。这是预期 —— 不要把它们当作"更抬升的一层"使用。`bg-muted` 直接套在 card 内可能视觉错乱，需要时用 `bg-muted/50` 或 `border` 替代。

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

## 组件语义配色约定

封装组件的语义配色属性（`color` / `type`，命名规则见 `component` skill）取值规则：

- **`color`** — 取值必须从固定枚举中选：`default | primary | success | info | help | warn | danger`。组件可按需取子集（例如不暴露 `primary`），但不得自创列表外的值
- **`type`** — 因为同时承载颜色以外的差异（icon、排版等），取值**按组件语义自由决定**：可以沿用上述列表，也可以增减值、省略 `default`、或改用其它名称（例如 ModalContent 额外引入 `error` 区分不同 icon）

映射配色方案时，`default` 必须使用 `secondary`（保持低强调的中性语义），只有明确的品牌强调态才用 `primary`。

### `default` / `primary` 映射

| variant | default | primary |
|---------|---------|---------|
| `flat`（仅填充） | `bg-secondary text-secondary-foreground` | `bg-primary/10 text-primary` |
| `soft`（填充 + 边框） | `bg-secondary text-secondary-foreground border-border` | `bg-primary/10 text-primary border-primary/50` |
| `bordered`（仅边框） | `border-border text-foreground` | `border-primary/50 text-primary` |
| `solid`（高对比填充） | `bg-accent text-accent-foreground` | `bg-primary text-primary-foreground` |

### 与语义状态色对照

以 `soft` variant 为例，带色 type 统一使用 `/10` 背景 + 实色文字 + `/50` 边框：

| color / type | 示例类 |
|------|--------|
| default | `bg-secondary text-secondary-foreground border-border` |
| primary | `bg-primary/10 text-primary border-primary/50` |
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