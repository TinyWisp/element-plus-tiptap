<script setup>
import Doc from './Doc.vue'
import cnManual from '@/docs/manual.zh_CN.md?raw'
</script>

<template>
  <main>
    <doc :cnt="cnManual" />
  </main>
</template>
