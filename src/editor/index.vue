<template>
  <div class="container">
    <div class="toolbar">
      <template v-for="(item, idx) of calcToolbarItems" :key="item.name + idx">
        <!-- divider -->
        <el-divider direction="vertical" v-if="item.name === 'divider'" />

        <!-- spacer -->
        <div class="spacer" v-else-if="item.name === 'spacer'" />

        <!-- custom button -->
        <v-node-renderer :vnodes="[item.vnode()]" v-else-if="item.vnode" />

        <!-- custom component -->
        <component :is="item.comp" :item="item" v-else-if="item.comp"></component>

        <!-- button -->
        <el-tooltip
          :key="(item.name ?? '') + idx"
          :content="typeof item.tip === 'string' ? item.tip : item.tip?.()"
          v-else
        >
          <el-button
            @click="clickToolbarButton(item)"
            text
            :bg="item?.isActive?.() ? true : undefined"
            :disabled="item?.isDisabled?.() ? true : false"
          >
            <template v-slot:icon>
              <icon :icon="item.icon"></icon>
            </template>
          </el-button>
        </el-tooltip>
      </template>
    </div>

    <div class="content">
      <editor-content :editor="editor" />
    </div>
  </div>

  <!-- the link dialog -->
  <insert-link-dialog
    v-model="linkDialog.show"
    v-model:title="linkDialog.title"
    v-model:url="linkDialog.url"
    @ok="applyLink()"
  />

  <!-- the network image dialog -->
  <insert-network-image-dialog
    v-model="networkImageDialog.show"
    v-model:url="networkImageDialog.url"
    @ok="insertNetworkImage()"
  />
</template>

<script setup>
import { ref, computed, isVNode, provide, onBeforeUnmount } from 'vue'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TableRow from '@tiptap/extension-table-row'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Markdown } from 'tiptap-markdown'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import en from './lang/en.js'
import zh_CN from './lang/zh_CN.js'
import get from 'lodash/get'
import InsertLinkDialog from './InsertLinkDialog.vue'
import InsertNetworkImageDialog from './InsertNetworkImageDialog.vue'
import TableBtn from './TableBtn/index.vue'
import Icon from './Icon.vue'
import VNodeRenderer from './VNodeRenderer.vue'

import {
  mdiUndo,
  mdiRedo,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethrough,
  mdiFormatUnderline,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatColorHighlight,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatListChecks,
  mdiFormatQuoteClose,
  mdiCodeTags,
  mdiImage,
  mdiLinkVariant,
  mdiLinkVariantOff,
  mdiMinus,
  mdiTablePlus,
  mdiTableMinus,
  mdiTableColumnPlusBefore,
  mdiTableColumnPlusAfter,
  mdiTableColumnRemove,
  mdiTableRowPlusBefore,
  mdiTableRowPlusAfter,
  mdiTableRowRemove,
  mdiTableSplitCell,
  mdiTableMergeCells,
} from '@mdi/js'
import { ElTooltip } from 'element-plus'

const props = defineProps({
  /**
   * type: html, json, markdown
   */
  type: {
    type: String,
    required: false,
    default: 'html',
  },

  /**
   * content
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * toolbar items
   */
  items: {
    type: Array,
    required: false,
    default: () => {
      return [
        'undo',
        'redo',
        '|',
        'heading1',
        'heading2',
        'heading3',
        'bold',
        'italic',
        'strikethrough',
        'underline',
        'subscript',
        'superscript',
        '|',
        'bulletedList',
        'numberedList',
        'quote',
        'horizontalRule',
        'link',
        'unlink',
        'insertImage',
        '|',
        'insertTable',
        'addColBefore',
        'addColAfter',
        'addRowBefore',
        'addRowAfter',
        'mergeOrSplitCell',
      ]
    },
  },

  /**
   * extensions for tiptap
   */
  exts: {
    type: Array,
    required: false,
    default: () => [],
  },

  /**
   * language
   */
  lang: {
    type: [Object, String],
    required: false,
    default: 'en',
  },
})

//---------------------------editor--------------------------
const emit = defineEmits(['update:modelValue'])
let extensions = [
  StarterKit.configure({
    link: false,
  }),
  Link.configure({
    autolink: true,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
    openOnClick: false,
  }),
  Image.configure({
    allowBase64: true,
  }),
  Underline,
  Table.configure({ resizable: true }),
  TableHeader,
  TableCell,
  TableRow,
  Subscript,
  Superscript,
  Highlight,
  TaskItem,
  TaskList,
]
if (props.exts) {
  const userExtNameMap = {}
  props.exts.forEach((userExt) => {
    userExtNameMap[userExt.name] = 1
  })
  extensions = extensions.filter((item) => !userExtNameMap[item.name])
  extensions = [...extensions, ...props.exts]
}
if (props.type === 'markdown') {
  extensions.push(
    Markdown.configure({
      html: false,
      transformCopiedText: true,
    }),
  )
}

const editor = useEditor({
  content: props.modelValue,
  extensions,
  onUpdate: () => {
    switch (props.type) {
      case 'markdown':
        emit('update:modelValue', editor.value.storage.markdown.getMarkdown())
        break

      case 'html':
        emit('update:modelValue', editor.value.getHTML())
        break

      case 'json':
        emit('update:modelValue', editor.value.getJSON())
        break
    }
  },
})

onBeforeUnmount(() => {
  editor.value.destroy()
})

//-------------------------toolbar------------------------
const toolbarItemMap = {
  undo: {
    name: 'undo',
    icon: mdiUndo,
    tip: t('buttonTip.undo'),
    isActive: () => {
      return false
    },
    isDisabled: () => {
      return !editor.value?.can()?.undo()
    },
    exec: () => {
      editor.value.chain().focus().undo().run()
    },
  },
  redo: {
    name: 'redo',
    tip: t('buttonTip.redo'),
    icon: mdiRedo,
    isActive: () => {
      return false
    },
    isDisabled: () => {
      return !editor.value?.can()?.redo()
    },
    exec: () => {
      editor.value.chain().focus().redo().run()
    },
  },
  bold: {
    name: 'bold',
    tip: t('buttonTip.bold'),
    icon: mdiFormatBold,
    isActive: () => {
      return editor.value?.isActive('bold')
    },
    exec: () => {
      editor.value.chain().focus().toggleBold().run()
    },
  },
  italic: {
    name: 'italic',
    tip: t('buttonTip.italic'),
    icon: mdiFormatItalic,
    isActive: () => {
      return editor.value?.isActive('italic')
    },
    exec: () => {
      editor.value.chain().focus().toggleItalic().run()
    },
  },
  strikethrough: {
    name: 'strikethrough',
    tip: t('buttonTip.strikethrough'),
    icon: mdiFormatStrikethrough,
    isActive: () => {
      return editor.value?.isActive('strike')
    },
    exec: () => {
      editor.value.chain().focus().toggleStrike().run()
    },
  },
  underline: {
    name: 'underline',
    tip: t('buttonTip.underline'),
    icon: mdiFormatUnderline,
    isActive: () => {
      return editor.value?.isActive('underline')
    },
    exec: () => {
      editor.value.chain().focus().toggleUnderline().run()
    },
  },
  subscript: {
    name: 'subscript',
    tip: t('buttonTip.subscript'),
    icon: mdiFormatSubscript,
    isActive: () => {
      return editor.value?.isActive('subscript')
    },
    exec: () => {
      editor.value.chain().focus().toggleSubscript().run()
    },
  },
  superscript: {
    name: 'superscript',
    tip: t('buttonTip.superscript'),
    icon: mdiFormatSuperscript,
    isActive: () => {
      return editor.value?.isActive('superscript')
    },
    exec: () => {
      editor.value.chain().focus().toggleSubscript().run()
    },
  },
  highlight: {
    name: 'highlight',
    tip: t('buttonTip.highlight'),
    icon: mdiFormatColorHighlight,
    isActive: () => {
      return editor.value?.isActive('highlight')
    },
    exec: () => {
      editor.value.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()
    },
  },
  heading1: {
    name: 'heading1',
    tip: t('buttonTip.heading1'),
    icon: mdiFormatHeader1,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 1 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 1 }).run()
    },
  },
  heading2: {
    name: 'heading2',
    tip: t('buttonTip.heading2'),
    icon: mdiFormatHeader2,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 2 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 2 }).run()
    },
  },
  heading3: {
    name: 'heading3',
    tip: t('buttonTip.heading3'),
    icon: mdiFormatHeader3,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 3 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 3 }).run()
    },
  },
  heading4: {
    name: 'heading4',
    tip: t('buttonTip.heading4'),
    icon: mdiFormatHeader4,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 4 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 4 }).run()
    },
  },
  heading5: {
    name: 'heading5',
    tip: t('buttonTip.heading5'),
    icon: mdiFormatHeader5,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 5 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 5 }).run()
    },
  },
  heading6: {
    name: 'heading6',
    tip: t('buttonTip.heading6'),
    icon: mdiFormatHeader6,
    isActive: () => {
      return editor.value?.isActive('heading', { level: 6 })
    },
    exec: () => {
      editor.value.chain().focus().toggleHeading({ level: 6 }).run()
    },
  },
  bulletedList: {
    name: 'bulletedList',
    tip: t('buttonTip.bulletedList'),
    icon: mdiFormatListBulleted,
    isActive: () => {
      return editor.value?.isActive('bulletList')
    },
    exec: () => {
      editor.value.chain().focus().toggleBulletList().run()
    },
  },
  numberedList: {
    name: 'numberedList',
    tip: t('buttonTip.numberedList'),
    icon: mdiFormatListNumbered,
    isActive: () => {
      return editor.value?.isActive('orderedList')
    },
    exec: () => {
      editor.value.chain().focus().toggleOrderedList().run()
    },
  },
  taskList: {
    name: 'taskList',
    tip: t('buttonTip.taskList'),
    icon: mdiFormatListChecks,
    isActive: () => {
      return editor.value?.isActive('taskList')
    },
    exec: () => {
      editor.value.chain().focus().toggleTaskList().run()
    },
  },
  quote: {
    name: 'quote',
    tip: t('buttonTip.quote'),
    icon: mdiFormatQuoteClose,
    isActive: () => {
      return editor.value?.isActive('blockquote')
    },
    exec: () => {
      editor.value.chain().focus().toggleBlockquote().run()
    },
  },
  codeBlock: {
    name: 'codeBlock',
    tip: t('buttonTip.code'),
    icon: mdiCodeTags,
    isActive: () => {
      return editor.value?.isActive('codeBlock')
    },
    exec: () => {
      editor.value.chain().focus().toggleCodeBlock().run()
    },
  },
  link: {
    name: 'link',
    tip: t('buttonTip.link'),
    icon: mdiLinkVariant,
    isActive: () => {
      return editor.value?.isActive('link')
    },
    exec: () => {
      showLinkDialog()
    },
  },
  unlink: {
    name: 'unlink',
    tip: t('buttonTip.unlink'),
    icon: mdiLinkVariantOff,
    isActive: () => {
      return false
    },
    isDisabled: () => {
      return !editor.value?.isActive('link')
    },
    exec: () => {
      editor.value.chain().focus().unsetLink().run()
    },
  },
  insertImage: {
    name: 'insertImage',
    tip: t('buttonTip.insertImage'),
    icon: mdiImage,
    exec: () => {
      showNetworkImageDialog()
    },
  },
  horizontalRule: {
    name: 'horizontalRule',
    tip: t('buttonTip.horizontalRule'),
    icon: mdiMinus,
    exec: () => {
      editor.value.chain().focus().setHorizontalRule().run()
    },
  },
  insertTable: {
    name: 'insertTable',
    tip: t('buttonTip.insertTable'),
    icon: mdiTablePlus,
    isDisabled: () => {
      return !editor.value?.can()?.insertTable()
    },
    comp: TableBtn,
  },
  deleteTable: {
    name: 'deleteTable',
    tip: t('buttonTip.deleteTable'),
    icon: mdiTableMinus,
    isDisabled: () => {
      return !editor.value?.can()?.deleteTable()
    },
    exec: () => {
      editor.value.chain().focus().deleteTable().run()
    },
  },
  addColBefore: {
    name: 'addColBefore',
    tip: t('buttonTip.addColBefore'),
    icon: mdiTableColumnPlusBefore,
    isDisabled: () => {
      return !editor.value?.can()?.addColumnBefore()
    },
    exec: () => {
      editor.value.chain().focus().addColumnBefore().run()
    },
  },
  addColAfter: {
    name: 'addColAfter',
    tip: t('buttonTip.addColAfter'),
    icon: mdiTableColumnPlusAfter,
    isDisabled: () => {
      return !editor.value?.can()?.addColumnAfter()
    },
    exec: () => {
      editor.value.chain().focus().addColumnAfter().run()
    },
  },
  deleteColumn: {
    name: 'deleteColumn',
    tip: t('buttonTip.deleteColumn'),
    icon: mdiTableColumnRemove,
    isDisabled: () => {
      return !editor.value?.can()?.deleteColumn()
    },
    exec: () => {
      editor.value.chain().focus().deleteColumn().run()
    },
  },
  addRowBefore: {
    name: 'addRowBefore',
    tip: t('buttonTip.addRowBefore'),
    icon: mdiTableRowPlusBefore,
    isDisabled: () => {
      return !editor.value?.can()?.addRowBefore()
    },
    exec: () => {
      editor.value.chain().focus().addRowBefore().run()
    },
  },
  addRowAfter: {
    name: 'addRowAfter',
    tip: t('buttonTip.addRowAfter'),
    icon: mdiTableRowPlusAfter,
    isDisabled: () => {
      return !editor.value?.can()?.addRowAfter()
    },
    exec: () => {
      editor.value.chain().focus().addRowAfter().run()
    },
  },
  deleteRow: {
    name: 'deleteRow',
    tip: t('buttonTip.deleteRow'),
    icon: mdiTableRowRemove,
    isDisabled: () => {
      return !editor.value?.can()?.deleteRow()
    },
    exec: () => {
      editor.value.chain().focus().deleteRow().run()
    },
  },
  mergeOrSplitCell: {
    name: 'mergeOrSplitCell',
    icon: () => {
      return editor.value?.can()?.splitCell() ? mdiTableSplitCell : mdiTableMergeCells
    },
    tip: () => {
      return editor.value?.can()?.splitCell() ? t('buttonTip.splitCell') : t('buttonTip.mergeCells')
    },
    isDisabled: () => {
      return !editor.value?.can()?.mergeCells() && !editor.value?.can()?.splitCell()
    },
    exec: () => {
      editor.value.chain().focus().mergeOrSplit().run()
    },
  },
  '|': {
    name: 'divider',
  },
}

const calcToolbarItems = computed(() => {
  const items = []

  props.items.forEach((val) => {
    if (typeof val === 'string') {
      if (!toolbarItemMap[val]) {
        console.error(`invalid toolbar item: ${val}`)
        return
      } else {
        const item = { ...toolbarItemMap[val] }
        if (!item?.name) {
          item.name = val
        }
        items.push(item)
        return
      }
    }

    if (isVNode(val)) {
      items.push({
        name: 'vnode',
        vnode: () => val,
      })
      return
    }

    if (typeof val === 'function') {
      items.push({
        name: 'vnode',
        vnode: val,
      })
      return
    }

    if (typeof val.render === 'function') {
      items.push({
        name: 'component',
        comp: val,
      })
      return
    }

    items.push(val)
  })

  return items
})

function clickToolbarButton(item) {
  if (item.exec) {
    item.exec()
  }
}

//--------------------------i18n-------------------------
function t(path, varMap = {}) {
  let msgMap = {}
  if (props.lang === 'en') {
    msgMap = en
  } else if (props.lang === 'zh_CN') {
    msgMap = zh_CN
  } else if (typeof props.lang === 'object') {
    msgMap = props.lang
  }

  let msg = get(msgMap, path)

  if (typeof msg !== 'string') {
    return path
  }

  for (const key in varMap) {
    const pattern = new RegExp(`{${key}}`, 'g')
    msg = msg.replace(pattern, varMap[key])
  }

  return msg
}
provide('t', t)

//--------------------------link-------------------------
const linkDialog = ref({
  show: false,
  title: '',
  url: '',
})

function showLinkDialog() {
  linkDialog.value.title = ''
  linkDialog.value.url = ''
  if (editor.value.isActive('link')) {
    editor.value.chain().focus().extendMarkRange('link').run()
    linkDialog.value.url = editor.getAttributes('link').href
  }

  const title = editor.value.state.doc.textBetween(
    editor.value.state.selection.from,
    editor.value.state.selection.to,
  )
  linkDialog.value.title = title
  linkDialog.value.show = true
}

function hideLinkDialog() {
  linkDialog.value.show = false
}

function applyLink() {
  hideLinkDialog()

  const selectionTitle = editor.value.state.doc.textBetween(
    editor.value.state.selection.from,
    editor.value.state.selection.to,
  )
  if (linkDialog.value.title !== selectionTitle) {
    const mark = editor.value.schema.marks.link.create({
      href: linkDialog.value.url,
      target: '_blank',
    })
    const from = editor.value.state.selection.from
    const transaction = editor.value.state.tr.deleteSelection()
    transaction.insertText(linkDialog.value.title)
    transaction.addMark(from, from + linkDialog.value.title.length, mark)
    editor.value.view.dispatch(transaction)
  } else {
    editor.value.chain().focus().setLink({ href: linkDialog.value.url, target: '_blank' }).run()
  }
}

//--------------------------network image-------------------------
const networkImageDialog = ref({
  show: false,
  url: '',
})

function showNetworkImageDialog() {
  networkImageDialog.value.url = ''
  networkImageDialog.value.show = true
}

function hideNetworkImageDialog() {
  networkImageDialog.value.show = false
}

function insertNetworkImage() {
  editor.chain().focus().setImage({ src: networkImageDialog.value.url }).run()
  hideNetworkImageDialog()
}

//----------------------------table-----------------------------
function insertTable(row, col) {
  editor.value
    .chain()
    .focus()
    .insertTable({
      rows: row,
      cols: col,
      withHeaderRow: true,
    })
    .run()
}
provide('insertTable', insertTable)
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  --el-fill-color-light: #f0f0f0;
}
.toolbar > button,
.toolbar > div {
  flex-shrink: 0;
  flex-grow: 0;
}
.toolbar > .spacer {
  flex-shrink: 1;
  flex-grow: 1;
}
.toolbar > :deep(.el-button + .el-button) {
  margin-left: 0;
}
.content {
  padding: 16px;
  min-height: 200px;
}
.container {
  border: 1px solid lightgray;
}
:deep(div.tiptap[role='textbox']) {
  outline: 0;
}
</style>
