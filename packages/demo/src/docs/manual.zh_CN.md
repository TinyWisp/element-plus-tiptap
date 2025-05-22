## 简介

`element-plus-tiptap` 是一个基于vue3, tiptap和element-plus的富文本编辑器, 简单易用。

## 快速开始

**安装**

```bash
npm install element-plus-tiptap
```

**引入**

```javascript
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'
```

**基础用法**

```iframe
#/demo?name=getting-started
```

## 自定义工具栏

```iframe
#/demo?name=custom-toolbar
```

## 高度自增长

```iframe
#/demo?name=auto-height
```

## 自定义语言

```iframe
#/demo?name=lang
```

## 输入/输出格式

**html**

```iframe
#/demo?name=html
```

**json**

```iframe
#/demo?name=json
```

**markdown**

```iframe
#/demo?name=markdown
```

## API

**属性**

| 属性名       | 类型    | 说明                         | 默认值                | 备注                  |
| ------------ | ------- | ---------------------------- | --------------------- | --------------------- |
| type         | string  | 枚举值: html, json, markdown | html                  | -                     |
| editable     | boolean | 是否可编辑                   | true                  | -                     |
| items        | array   | 工具栏项                     | ['undo', 'redo', ...] | -                     |
| exts         | array   | tiptap的扩展                 | []                    | -                     |
| options      | object  | tiptap的配置项               | {}                    | -                     |
| locale       | string  | 语言                         | en                    | 内置的语言有en, zh_CN |
| langResource | object  | 语言资源                     | -                     | -                     |
| hideToolbar  | boolean | 是否隐藏工具栏               | false                 | -                     |
| autoHeight   | boolean | 高度是否随内容自动增长       | false                 | -                     |

**items属性**

该属性表示工具栏上的项，它是一个数组。它的元素，可以是String, Component, VNode, Object.

- `String`: 表示内置的工具栏项的名称。
- `Object`: 表示自定义工具栏项
- `Component`: 自定义组件

Object元素，其属性如下

| 属性名     | 类型                   | 说明                 | 默认值 | 备注                                                                                                                                                                       |
| ---------- | ---------------------- | -------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon       | string \| () => string | 图标                 | -      | 这几种都可以: <br> 1.图片地址 <br> 2.base64编码的图片, "data:image/png;..."这样的。 <br> 3. 从@mdi/js中引入的图标。 4.直接import一个图片 <br> 5.一个函数，返回前面几种数据 |
| tip        | string \| () => string | 文字提示             | -      |                                                                                                                                                                            |
| isActive   | (context) => boolean   | 是否处于该状态下     | -      | 返回true时按钮显示背景色                                                                                                                                                   |
| isDisabled | (context) => boolean   | 是否禁用             | -      |                                                                                                                                                                            |
| exec       | (context) => void      | 点击按钮时执行的方法 | -      |                                                                                                                                                                            |

### 内置的工具栏项

| 名称             | 说明             |
| ---------------- | ---------------- |
| \|               | 竖线分隔符       |
|                  | 空白             |
| undo             | 撤消             |
| redo             | 重做             |
| bold             | 粗体             |
| italic           | 斜体             |
| strikethrough    | 删除线           |
| underline        | 下划线           |
| subscript        | 下标             |
| superscript      | 上标             |
| heading1         | 1号标题          |
| heading2         | 2号标题          |
| heading3         | 3号标题          |
| heading4         | 4号标题          |
| heading5         | 5号标题          |
| heading6         | 6号标题          |
| alignLeft        | 左对齐           |
| alignRight       | 左对齐           |
| alignCenter      | 居中对齐         |
| alignJustify     | 两端对齐         |
| bulletedList     | 有序列表         |
| numberedList     | 无序列表         |
| taskList         | 任务列表         |
| quote            | 引用             |
| codeBlock        | 代码块           |
| horizontalRule   | 水平线           |
| link             | 链接             |
| unlink           | 取消链接         |
| insertImage      | 插入图片         |
| insertTable      | 插入表格         |
| deleteTable      | 删除表格         |
| addColBefore     | 往左添加一列     |
| addColAfter      | 往右添加一列     |
| deleteColumn     | 删除列           |
| addRowBefore     | 往上添加一行     |
| addRowAfter      | 往下添加一行     |
| deleteRow        | 删除行           |
| mergeOrSplitCell | 合并或分割单元格 |

### context

- context是一个对像，包含了可能需要的各种资源

| 属性   | 类型                   | 说明             |
| ------ | ---------------------- | ---------------- |
| editor | Object                 | tiptap的实例     |
| t      | function(path, varMap) | 翻译             |
| props  | Object                 | 传递给组件的参数 |
