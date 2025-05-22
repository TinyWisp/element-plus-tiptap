<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'

const cnt = ref('hello world')
</script>

<template>
  <div style="width: 100%; height: 500px">
    <element-plus-tiptap v-model="cnt" type="html" :auto-height="true" />
  </div>
</template>
