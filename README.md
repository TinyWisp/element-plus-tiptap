# element-plus-tiptap

[![GitHub](https://img.shields.io/github/license/tinywisp/element-plus-tiptap)](https://github.com/TinyWisp/element-plus-tiptap/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/element-plus-tiptap)](https://www.npmjs.com/package/element-plus-tiptap)

`element-plus-tiptap` is a rich text editor based on Vue 3, Tiptap, and Element Plus. It's simple and easy to use.

- [Docs](https://tinywisp.github.io/element-plus-tiptap/#en)
- [Getting Started](#getting-started)

---

`element-plus-tiptap` 是一个富文本编辑器，它基于vue3, titap和element-plus。使用起来很简单。

- [文档](https://tinywisp.github.io/element-plus-tiptap/#cn)
- [快速开始](#快速开始)

---

## Getting Started

install

```bash
npm install element-plus-tiptap
```

import

```javascript
import { ElementPlusTiptap } from "element-plus-tiptap";
import "element-plus-tiptap/dist/theme.css";
```

usage

```javascript
<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'

const content = ref('hello world')
</script>

<template>
  <element-plus-tiptap v-model="content" />
</template>
```

---

## 快速开始

安装

```bash
npm install element-plus-tiptap
```

引入

```javascript
import { ElementPlusTiptap } from "element-plus-tiptap";
import "element-plus-tiptap/dist/theme.css";
```

示例

```javascript
<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'

const content = ref('hello world')
</script>

<template>
  <element-plus-tiptap v-model="content" />
</template>
```
