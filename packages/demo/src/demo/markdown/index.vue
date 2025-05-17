<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from '@tinywisp/element-plus-tiptap'
import '@tinywisp/element-plus-tiptap/dist/theme.css'

const content = ref('# hello world!')
</script>

<template>
  <el-input
    :model-value="content"
    style="width: 100%"
    :rows="10"
    :readonly="true"
    type="textarea"
    placeholder=""
  />
  <element-plus-tiptap v-model="content" type="markdown" />
</template>
