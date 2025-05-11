<script setup>
import { ref } from 'vue'
import Editor from './editor/index.vue'

const content = ref('')
</script>

<template>
  <editor v-model="content"></editor>
</template>

<style scoped></style>
