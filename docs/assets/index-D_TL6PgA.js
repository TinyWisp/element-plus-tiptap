const t=`<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'

const content = ref('hello world')
<\/script>

<template>
  <div class="container">
    <element-plus-tiptap v-model="content" />
  </div>
</template>

<style scoped>
.container {
  width: 600px;
  height: 300px;
  border: 0;
}
</style>
`;export{t as default};
