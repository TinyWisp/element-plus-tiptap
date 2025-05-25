<template>
  <element-plus-tiptap v-model="content" :items="items" />
</template>

<script setup>
import { ref } from 'vue'
import { ElementPlusTiptap } from 'element-plus-tiptap'
import 'element-plus-tiptap/dist/theme.css'
import LinkIcon from './link.png'
import DebianIcon from './debian.png'
import HelloWorldBtn from './HelloWorldBtn.vue'

const items = [
  'undo',
  'redo',
  '|',
  'heading1',
  'heading2',
  'heading3',
  'link',
  { name: 'link', icon: LinkIcon, tip: '~~link~~' },
  {
    name: 'debian',
    icon: DebianIcon,
    tip: 'debian',
    exec: (context) => {
      context.editor.value
        .chain()
        .focus()
        .setImage({ src: 'https://www.debian.org/Pics/debian-logo-1024x576.png' })
        .run()
    },
  },
  {
    name: 'hello world',
    color: 'red',
    comp: HelloWorldBtn,
  },
  ' ',
  {
    name: 'hello world2',
    color: 'blue',
    comp: HelloWorldBtn,
  },
]
const content = ref('')
</script>
