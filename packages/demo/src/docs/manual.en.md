## Introduction

`element-plus-tiptap` is a rich text editor based on Vue 3, Tiptap, and Element Plus. It's simple and easy to use.

## Getting Started

**Install**

```bash
npm install element-plus-tiptap
```

**Import**

```javascript
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'
```

**Basic Usage**

```iframe
#/demo?name=getting-started
```

## Custom Toolbar

```iframe
#/demo?name=custom-toolbar
```

## Language

```iframe
#/demo?name=lang
```

## Input/Output Format

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

**Properties**

| 属性名       | 类型    | 说明                              | 默认值                | 备注                         |
| ------------ | ------- | --------------------------------- | --------------------- | ---------------------------- |
| type         | string  | enum values: html, json, markdown | html                  |                              |
| editable     | boolean | whether it is editable or not     | true                  | -                            |
| items        | array   | items of the toolbar              | ['undo', 'redo', ...] | -                            |
| exts         | array   | extensions for tiptap             | []                    | -                            |
| options      | object  | options for tiptap                | {}                    | -                            |
| locale       | string  | language                          | en                    | built-in languages:en, zh_CN |
| langResource | object  | language resource                 | -                     |                              |

**items**

This property represents the items of the toolbar. It’s an array where the elements can be `String`, `Component`, `VNode`, or `Object`.

- `String`: name of a built-in toolbar item.
- `Object`: an object with custom icon, tip and behaviors.
- `Component`: a custom component.

Attributes for Object Elements

| Property   | Data Type              | Description                   | Default Value | Note                                                                                                                                                                                        |
| ---------- | ---------------------- | ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon       | string \| () => string | Icon                          | -             | various options: <br>1. image URL <br>2. base64-encoded image (e.g., data:image/png;...) <br>3. an icon from @mdi/js <br>4. an imported image <br>5. a function returning any of the above. |
| tip        | string \| () => string | tooltip text                  | -             |                                                                                                                                                                                             |
| isActive   | (context) => boolean   | whether it is active or not   | -             | displays background color when returning true                                                                                                                                               |
| isDisabled | (context) => boolean   | whether it is disabled or not | -             |                                                                                                                                                                                             |
| exec       | (context) => void      | the method to execute         | -             |                                                                                                                                                                                             |

### Built-in Items

| Name             | Description          |
| ---------------- | -------------------- |
| \|               | vertical line        |
|                  | blank                |
| undo             |                      |
| redo             |                      |
| bold             |                      |
| italic           |                      |
| strikethrough    |                      |
| underline        |                      |
| subscript        |                      |
| superscript      |                      |
| heading1         |                      |
| heading2         |                      |
| heading3         |                      |
| heading4         |                      |
| heading5         |                      |
| heading6         |                      |
| alignLeft        |                      |
| alignRight       |                      |
| alignCenter      |                      |
| alignJustify     |                      |
| bulletedList     |                      |
| numberedList     |                      |
| taskList         |                      |
| quote            |                      |
| codeBlock        |                      |
| horizontalRule   |                      |
| link             |                      |
| unlink           |                      |
| insertImage      |                      |
| insertTable      |                      |
| deleteTable      |                      |
| addColBefore     |                      |
| addColAfter      |                      |
| deleteColumn     |                      |
| addRowBefore     |                      |
| addRowAfter      |                      |
| deleteRow        |                      |
| mergeOrSplitCell | merge or split cells |

### context

`context` is an object including containing various resources you might need

| Property | Data Type              | Description                     |
| -------- | ---------------------- | ------------------------------- |
| editor   | object                 | the instance of tiptap          |
| t        | function(path, varMap) | translate                       |
| props    | object                 | properties passed to the editor |
