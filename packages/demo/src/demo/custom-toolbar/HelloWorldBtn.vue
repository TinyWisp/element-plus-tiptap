<template>
  <el-button @click="handleClick">hello world!</el-button>
</template>

<script setup>
import { inject } from 'vue'

const context = inject('context')

function handleClick() {
  context.editor.value.chain().focus().insertContent('hello world!').run()
}
</script>
