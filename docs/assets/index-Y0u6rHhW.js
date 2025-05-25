const t=`<template>
  <element-plus-tiptap v-model="content" locale="jp" :lang-resource="{ jp }" />
</template>

<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'
import jp from './jp'

const content = ref('')
<\/script>
`;export{t as default};
