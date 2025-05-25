const t=`<template>
  <element-plus-tiptap v-model="content" :auto-height="true" />
</template>

<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'

const content = ref('hello world')
<\/script>
`;export{t as default};
