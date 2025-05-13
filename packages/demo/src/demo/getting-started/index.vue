<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from '@tinywisp/element-plus-tiptap'
import '@tinywisp/element-plus-tiptap/dist/theme.css'

const content = ref('hello world')
</script>

<template>
  <main>
    <element-plus-tiptap v-model="content" />
  </main>
</template>
