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
          <el-button @click="exec(item)" text :bg="isActive(item)" :disabled="isDisabled(item)">
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
</template>

<script setup>
import { ref, computed, watch, isVNode, provide, onBeforeUnmount } from 'vue'
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
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Markdown } from 'tiptap-markdown'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import en from './lang/en.js'
import zh_CN from './lang/zh_CN.js'
import Lang from './Lang.js'
import TableBtn from './TableBtn/index.js'
import LinkBtn from './LinkBtn/index.js'
import ImageBtn from './ImageBtn/index.js'
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
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiFormatAlignJustify,
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
    type: [String, Object],
    default: '',
  },

  /**
   * editable
   */
  editable: {
    type: Boolean,
    default: true,
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
   * options for tiptap
   */
  options: {
    type: Object,
    required: false,
    default: () => {
      return {}
    },
  },

  /**
   * locale
   */
  locale: {
    type: String,
    required: false,
    default: 'en',
  },

  /**
   * language resource
   */
  langResource: {
    type: Object,
    required: false,
    default: () => {},
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
  Color,
  TextStyle,
]

if (props.type === 'markdown') {
  extensions.push(
    Markdown.configure({
      html: false,
      transformCopiedText: true,
    }),
  )
}

if (props.exts) {
  const userExtNameMap = {}
  props.exts.forEach((userExt) => {
    userExtNameMap[userExt.name] = 1
  })
  extensions = extensions.filter((item) => !userExtNameMap[item.name])
  extensions = [...extensions, ...props.exts]
}

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
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
  ...props.options,
})

watch(
  () => props.editable,
  () => {
    if (!editor.value) {
      return
    }

    editor.value.setEditable(props.editable)
  },
)

onBeforeUnmount(() => {
  editor.value.destroy()
})

//--------------------------i18n-------------------------
const lang = new Lang()
lang.merge({
  en,
  zh_CN,
})
lang.merge(props.langResource)
const locale = ref(props.locale)
lang.setLocale(locale.value)
watch(
  () => props.locale,
  () => {
    lang.setLocale(props.locale)
  },
)
const { t } = lang

//-------------------------toolbar------------------------
const toolbarItemMap = {
  undo: {
    name: 'undo',
    icon: mdiUndo,
    tip: t('toolbar.undo'),
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
    tip: t('toolbar.redo'),
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
    tip: t('toolbar.bold'),
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
    tip: t('toolbar.italic'),
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
    tip: t('toolbar.strikethrough'),
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
    tip: t('toolbar.underline'),
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
    tip: t('toolbar.subscript'),
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
    tip: t('toolbar.superscript'),
    icon: mdiFormatSuperscript,
    isActive: () => {
      return editor.value?.isActive('superscript')
    },
    exec: () => {
      editor.value.chain().focus().toggleSubscript().run()
    },
  },
  alignLeft: {
    name: 'alignLeft',
    tip: t('toolbar.alignLeft'),
    icon: mdiFormatAlignLeft,
    isActive: () => {
      return editor.value?.isActive({ textAlign: 'left' })
    },
    exec: () => {
      editor.value.chain().focus().setTextAlign('left').run()
    },
  },
  alignRight: {
    name: 'alignRight',
    tip: t('toolbar.alignRight'),
    icon: mdiFormatAlignRight,
    isActive: () => {
      return editor.value?.isActive({ textAlign: 'right' })
    },
    exec: () => {
      editor.value.chain().focus().setTextAlign('right').run()
    },
  },
  alignCenter: {
    name: 'alignCenter',
    tip: t('toolbar.alignCenter'),
    icon: mdiFormatAlignCenter,
    isActive: () => {
      return editor.value?.isActive({ textAlign: 'center' })
    },
    exec: () => {
      editor.value.chain().focus().setTextAlign('center').run()
    },
  },
  alignJustify: {
    name: 'alignJustify',
    tip: t('toolbar.alignJustify'),
    icon: mdiFormatAlignJustify,
    isActive: () => {
      return editor.value?.isActive({ textAlign: 'justify' })
    },
    exec: () => {
      editor.value.chain().focus().setTextAlign('justify').run()
    },
  },
  highlight: {
    name: 'highlight',
    tip: t('toolbar.highlight'),
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
    tip: t('toolbar.heading1'),
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
    tip: t('toolbar.heading2'),
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
    tip: t('toolbar.heading3'),
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
    tip: t('toolbar.heading4'),
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
    tip: t('toolbar.heading5'),
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
    tip: t('toolbar.heading6'),
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
    tip: t('toolbar.bulletedList'),
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
    tip: t('toolbar.numberedList'),
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
    tip: t('toolbar.taskList'),
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
    tip: t('toolbar.quote'),
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
    tip: t('toolbar.code'),
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
    tip: t('toolbar.link'),
    icon: mdiLinkVariant,
    comp: LinkBtn,
  },
  unlink: {
    name: 'unlink',
    tip: t('toolbar.unlink'),
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
    tip: t('toolbar.insertImage'),
    icon: mdiImage,
    comp: ImageBtn,
  },
  horizontalRule: {
    name: 'horizontalRule',
    tip: t('toolbar.horizontalRule'),
    icon: mdiMinus,
    exec: () => {
      editor.value.chain().focus().setHorizontalRule().run()
    },
  },
  insertTable: {
    name: 'insertTable',
    tip: t('toolbar.insertTable'),
    icon: mdiTablePlus,
    isDisabled: () => {
      return !editor.value?.can()?.insertTable()
    },
    comp: TableBtn,
  },
  deleteTable: {
    name: 'deleteTable',
    tip: t('toolbar.deleteTable'),
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
    tip: t('toolbar.addColBefore'),
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
    tip: t('toolbar.addColAfter'),
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
    tip: t('toolbar.deleteColumn'),
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
    tip: t('toolbar.addRowBefore'),
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
    tip: t('toolbar.addRowAfter'),
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
    tip: t('toolbar.deleteRow'),
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
      return editor.value?.can()?.splitCell() ? t('toolbar.splitCell') : t('toolbar.mergeCells')
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
  ' ': {
    name: 'spacer',
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

    if (typeof val === 'object' && toolbarItemMap[val.name]) {
      items.push({
        ...toolbarItemMap[val.name],
        ...val,
      })
      return
    }
    items.push(val)
  })

  return items
})

function isActive(item) {
  if (!item.isActive || !editor.value) {
    return false
  }

  return item.isActive(editor.value)
}

function isDisabled(item) {
  if (!item.isDisabled || !editor.value) {
    return false
  }

  return item.isDisabled(editor.value)
}

function exec(item) {
  if (!item.exec || !editor.value) {
    return null
  }

  return item.exec(context)
}

//--------------------------context-------------------------
const context = {
  editor,
  props,
  t,
  toolbar: {
    items: calcToolbarItems,
    isActive,
    isDisabled,
    exec,
  },
}
provide('context', context)
defineExpose({ context })
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
