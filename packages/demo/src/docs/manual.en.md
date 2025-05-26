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
/element-plus-tiptap/#/demo?name=getting-started
```

## Custom Toolbar

```iframe
/element-plus-tiptap/#/demo?name=custom-toolbar
```

## Language

### Simplified Chinese

```iframe
/element-plus-tiptap/#/demo?name=chinese
```

### Custom Language

Currently, only English and Simplified Chinese are supported, and you can set them using `locale="en"` and `locale="zh_CN"`. If other languages are needed, the parameters `locale` and `langResource` must be used together to achieve this.

```iframe
/element-plus-tiptap/#/demo?name=lang
```

## Appearence

### Size

```iframe
/element-plus-tiptap/#/demo?name=size
```

### Auto Height

```iframe
/element-plus-tiptap/#/demo?name=auto-height
```

## Input/Output Format

### html

```iframe
/element-plus-tiptap/#/demo?name=html
```

### json

```iframe
/element-plus-tiptap/#/demo?name=json
```

### markdown

```iframe
/element-plus-tiptap/#/demo?name=markdown
```

## API

### Properties

| 属性名           | 类型             | 说明                                                                                                                                                                      | 默认值                | 备注                         |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- |
| type             | string           | enum values: html, json, markdown                                                                                                                                         | html                  |                              |
| editable         | boolean          | whether it is editable or not                                                                                                                                             | true                  |                              |
| items            | array            | items of the toolbar                                                                                                                                                      | ['undo', 'redo', ...] |                              |
| exts             | array            | extensions for tiptap                                                                                                                                                     | []                    |                              |
| options          | object           | options for tiptap                                                                                                                                                        | {}                    |                              |
| locale           | string           | language                                                                                                                                                                  | en                    | built-in languages:en, zh_CN |
| langResource     | object           | language resource                                                                                                                                                         |                       |                              |
| hideToolbar      | boolean          | whether to hide the toolbar                                                                                                                                               | false                 |                              |
| autoHeight       | boolean          | whether to fit its height to its content                                                                                                                                  | false                 |                              |
| fnUploadImage    | (file) => string | a function to upload an image and return its url                                                                                                                          |                       |                              |
| enablePasteImage | boolean          | whether to enable the image pasting handler. <br> if set to true, the editor will upload the pasted image through the fnUploadImage property and display it in the editor | true                  |                              |

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

### Built-in Toolbar Items

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

`context` is an object containing various resources you might need

| Property | Data Type              | Description                     |
| -------- | ---------------------- | ------------------------------- |
| editor   | object                 | the instance of tiptap          |
| t        | function(path, varMap) | translate                       |
| props    | object                 | properties passed to the editor |
