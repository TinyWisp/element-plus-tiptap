const t=`<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'

const content = ref('<h1>hello world!</h1>')
<\/script>

<template>
  <el-input
    :model-value="content"
    style="width: 100%"
    :rows="10"
    :readonly="true"
    type="textarea"
    placeholder=""
  />
  <div style="width: 100%; height: 400px">
    <element-plus-tiptap v-model="content" type="html" />
  </div>
</template>
`;export{t as default};
