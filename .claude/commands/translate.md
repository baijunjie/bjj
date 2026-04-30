语言文件翻译（使用子代理）

## 执行步骤

1. 对所有包执行 `pnpm -r --if-present i18n:build` 同步语言文件结构
2. 检查各语言文件中带 `__<<<` 后缀的 key 数量：`grep -c '__<<<' packages/*/i18n/messages/*.json`
3. 跳过没有 `__<<<` 条目的包和语言文件
4. 为每种语言启动一个子代理并行翻译（每个子代理负责一种语言在所有包中的翻译）

## 子代理配置

使用 Task 工具启动子代理时，必须遵循以下配置：

```
subagent_type: general-purpose
model: haiku
run_in_background: false（禁止后台运行）
```

## 提示词模板

提示词必须简洁，避免过度指导。根据有 `__<<<` 后缀 key 的文件动态生成列表：

```
读取以下文件，找到所有以 "__<<<" 结尾的 key（如 "title__<<<": "Dashboard"），将值翻译成{语言名称}，然后去掉 key 的 "__<<<" 后缀。用 Edit 工具替换。保留占位符如 {percent}、{count} 等。不要执行 git 操作。

文件列表：
- packages/xxx/i18n/messages/{lang}.json
- packages/yyy/i18n/messages/{lang}.json
```

> 仅列出有 `__<<<` 条目的文件，跳过无需翻译的文件。

## 注意事项

- **提示词要简洁**：过于详细的规则会导致子代理逐条处理，效率低下
- **不要指定实现方式**：让子代理自行决定批量处理还是逐条处理
- **使用 haiku 模型**：翻译任务重复性强，haiku 足够且更快
- **并行启动**：在单条消息中同时调用多个 Task 工具
