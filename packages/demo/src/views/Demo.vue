<template>
  <div class="demo-container">
    <div class="demo" :style="{ height: demoHeight }">
      <component :is="comp" />
    </div>
    <div :class="['code-container', { collapsed: codeCollapsed }]">
      <div class="code-header">
        <div class="code-tabs">
          <div
            v-for="(item, idx) of codeTabs"
            :key="item.title"
            :class="['code-tab', { active: activeIdx === idx }]"
            @click="activeIdx = idx"
          >
            {{ item.title }}
          </div>
        </div>
        <div class="buttons">
          <div v-if="!codeCopied" @click="copyCode" class="button">
            <span>copy</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
              />
            </svg>
          </div>
          <div v-else class="button">
            <span>copied</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="code-body">
        <pre v-html="codeBodyHtml" />
      </div>
      <div class="code-footer" @click="expandOrCollapse">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed } from 'vue'
import copy from 'copy-to-clipboard'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/github.css'
import { watch } from 'vue'
import demoMap from '../demo'
import { useRoute } from 'vue-router'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

const route = useRoute()
const name = route.query.name
const demo = demoMap[name]

const comp = defineAsyncComponent(demo.comp)
const codeTabs = demo.codeTabs
const activeIdx = ref(0)
const codeBodyHtml = ref('')
const codeCollapsed = ref(true)
const codeCopied = ref(false)

watch(
  activeIdx,
  async () => {
    const rawCodeModule = await codeTabs[activeIdx.value].code()
    codeBodyHtml.value = hljs.highlight(rawCodeModule.default, { language: 'javascript' }).value
  },
  { immediate: true },
)

async function copyCode() {
  const rawCodeModule = await codeTabs[activeIdx.value].code()
  copy(rawCodeModule.default)
  codeCopied.value = true
  setTimeout(() => {
    codeCopied.value = false
  }, 3000)
}

function expandOrCollapse() {
  codeCollapsed.value = !codeCollapsed.value
}

const demoHeight = computed(() => {
  return demo.height ?? '500px'
})
</script>

<style scoped>
.demo-container {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  border: 1px solid lightgray;
  border-radius: 3px;
  background-color: white;
}
.demo {
  width: 100%;
  overflow: auto;
}
.code-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: auto;
}

.code-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ebebeb;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  height: 3em;
}

.code-container.collapsed .code-header {
  display: none;
}

.code-tabs {
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.code-tab {
  display: block;
  width: auto;
  padding: 0.2em 1em;
  margin: 0 0.5em 0 0.5em;
  border-radius: 2px;
  cursor: pointer;
}
.code-tab:hover {
  background-color: #e0e0e0;
}
.code-tab.active {
  background-color: #c0c0c0;
}
.button {
  width: 36px;
  height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 18px;
  margin-right: 0.5em;
  cursor: pointer;
  position: relative;
}
.button span {
  display: none;
  position: absolute;
  left: 50%;
  top: -3em;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  font-size: 14px;
  padding: 0.5em 1em;
  border-radius: 3px;
}
.button:hover {
  background-color: #e0e0e0;
}
.button:hover svg {
  fill: dimgray;
}
.button:hover span {
  display: block;
}
.button svg {
  width: 24px;
  height: 24px;
  fill: #c0c0c0;
}
.code-body {
  background-color: #f9f9f9;
  padding: 1em;
  height: auto;
}
.code-container.collapsed .code-body {
  display: none;
}
.code-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ebebeb;
  border-top: 1px solid lightgray;
  border-bottom: 0;
  cursor: pointer;
  width: 100%;
  height: 3em;
}
.code-container.collapsed .code-footer svg {
  transform: rotate(0);
}
.code-footer svg {
  width: 24px;
  height: 24px;
  fill: #c0c0c0;
  transform: rotate(180deg);
}
.code-footer:hover svg {
  fill: dimgray;
}
</style>
