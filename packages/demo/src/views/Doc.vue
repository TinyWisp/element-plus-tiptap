<template>
  <div class="page">
    <div class="toc">
      <ul class="items">
        <li
          v-for="(item, idx) of headingList"
          :key="item.content + idx"
          :class="[`level${item.level}`, { active: item.anchor === activeId }]"
          @click="handleClickMenu(item)"
        >
          {{ item.content }}
        </li>
      </ul>
    </div>
    <div class="doc" v-html="html"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import markdownit from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import { iframeResize } from 'iframe-resizer'
import { useActiveScroll } from 'vue-use-active-scroll'

const props = defineProps({
  cnt: {
    type: String,
    required: true,
  },
})

let counter = 0
const uniqId = () => {
  counter += 1
  return `uniq-id-${counter}`
}

const headingList = ref([])
const headingIdList = computed(() => {
  return headingList.value.map((item) => item.anchor)
})
const { setActive, activeId } = useActiveScroll(headingIdList)

function handleClickMenu(item) {
  const id = item.anchor
  const el = document.getElementById(id)

  if (el) {
    el.scrollIntoView()
    setActive(id)
  }
}

const md = markdownit({
  html: true,
  highlight: function (code, lang) {
    if (lang === 'iframe') {
      const url = code.trim()
      const id = uniqId()
      setTimeout(() => {
        iframeResize([{}], `#${id}`)
      }, 10)
      return `<pre><iframe src="${url}" id="${id}"></iframe></pre>`
    } else {
      return `<pre><code lang="${lang}">${code}</code></pre>`
    }
  },
}).use(markdownItTocAndAnchor, {
  tocCallback(tmarkdown, tarray) {
    headingList.value = tarray
  },
})

const html = computed(() => {
  return md.render(props.cnt)
})
</script>

<style lang="scss">
.page {
  width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0 auto;

  .toc {
    width: 240px;
    border-right: 1px solid lightgray;

    ul {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      position: fixed;
      list-style: none;
      padding-inline-start: 5px;
      padding-inline-end: 5px;
      width: 220px;
      cursor: pointer;

      li {
        color: rgb(33, 53, 71);
        text-decoration: none;
        line-height: 2;
        width: 100%;
        border-radius: 2px;

        &.level2 {
          text-indent: 10px;
        }

        &.level3 {
          text-indent: 32px;
        }

        &.active {
          background-color: rgb(187, 224, 224);
        }

        &:hover {
          color: teal;
        }
      }
    }
  }

  .doc {
    width: 960px;
    padding: 0 20px;

    iframe {
      width: 100%;
      border: 0;
    }

    table {
      border-spacing: 0;
      width: auto;
      overflow: auto;
      word-break: normal;
      word-break: keep-all;
      border: 1px solid lightgray;
      border-radius: 3px;
      border-collapse: separate;
      overflow: hidden;
    }

    table th {
      background-color: #f6f8fa;
      color: var(--viewer-primary-color);
      font-weight: bold;
      text-align: left;
    }

    td,
    th {
      padding: 0.5em 1em;
      border: 0;
      height: 2em;
      min-width: 4em;
    }

    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }

    tr td:not(:last-child) {
      border-right: 1px solid lightgray;
    }

    tr th:not(:last-child) {
      border-right: 1px solid lightgray;
    }

    tr:hover td {
      background-color: #eaf3f3;
    }

    img {
      max-width: 100%;
    }

    img.emoji {
      display: inline;
      border: 0;
      width: 1em;
      height: 1em;
      padding: 0;
      margin: 0;
    }

    a {
      color: var(--viewer-primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    a > code {
      color: #476582;
      text-decoration: none;
    }

    p > code,
    li > code {
      color: saddlebrown;
      background-color: #f1f1f1;
      padding: 0 0.5em;
      border-radius: 4px;
    }

    pre > code {
      padding: 20px;
      border-radius: 4px;
      background-color: #ebebeb;
      width: 100%;
      margin: 20px 0;
      display: block;
      box-sizing: border-box;
    }

    p {
      line-height: 1.6em;
      letter-spacing: 0.2px;
    }

    strong {
      color: saddlebrown;
      font-weight: bold;
    }

    mark {
      padding: 0.15em 0.5em;
    }

    blockquote {
      padding: 20px;
      border-left: 4px solid var(--viewer-primary-color);
      background-color: #f3f5f7;
      white-space: nowrap;
      color: #57606a;
    }

    ul {
      margin: 0.5em 0;
      padding-left: 2em;
      list-style: disc;
    }

    li + li {
      margin-top: 0.25em;
    }

    ul.contains-task-list {
      list-style: none;
    }
    .task-list-item-checkbox {
      vertical-align: middle;
      display: inline-block;
    }

    ol {
      padding-left: 1.25em;
    }

    h1 {
      margin: 0 0 3rem;
      font-size: 2.4em;
      line-height: 1.4em;
      font-weight: 600;
      padding-bottom: 0.7em;
      border-bottom: 1px solid #d8dee4;
      width: 100%;
    }

    h2 {
      font-size: 1.5em;
      font-weight: 600;
      margin: 2.8em 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid #d8dee4;
      width: 100%;
    }

    h3 {
      font-size: 1.2em;
      font-weight: 600;
      margin: 3rem 0 1.25rem 0;
    }

    h4 {
      font-size: 1em;
      margin: 1em 0;
    }

    h5 {
      font-size: 0.85em;
      margin: 1em 0;
    }

    h6 {
      font-size: 0.7em;
      margin: 1em 0;
    }

    hr {
      margin: 1.5em 0;
      width: 100%;
    }

    .nothing {
      display: none;
    }

    p,
    ul,
    ol,
    summary,
    table,
    pre,
    blockquote {
      margin-bottom: 1.2em;
    }

    blockquote > p {
      text-wrap: wrap;
      margin-bottom: 0;
    }

    pre {
      display: block;
      width: 100%;
      height: auto;
      position: relative;
    }
  }
}
</style>
