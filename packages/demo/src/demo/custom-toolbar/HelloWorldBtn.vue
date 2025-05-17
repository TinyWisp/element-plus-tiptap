<template>
  <el-button @click="handleClick" :style="{ color: item.color }">hello world!</el-button>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const context = inject('context')

function handleClick() {
  context.editor.value
    .chain()
    .focus()
    .setColor(props.item.color)
    .insertContent('hello world!\n')
    .run()
}
</script>
