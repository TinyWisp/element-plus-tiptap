<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from '@tinywisp/element-plus-tiptap'
import '@tinywisp/element-plus-tiptap/dist/theme.css'
import jp from './jp'

const content = ref('')
</script>

<template>
  <element-plus-tiptap v-model="content" locale="jp" :lang-resource="{ jp }" />
</template>
