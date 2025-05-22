<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'

const cnt = ref({})
setTimeout(() => {
  cnt.value = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'abcdef' }] }],
  }
}, 5000)
</script>

<template>
  <div style="width: 100%; height: 500px">
    <element-plus-tiptap v-model="cnt" :hide-toolbar="true" type="json" />
  </div>
</template>
