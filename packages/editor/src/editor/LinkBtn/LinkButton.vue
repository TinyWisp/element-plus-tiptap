<template>
  <el-tooltip :content="t('toolbar.link')" placement="bottom">
    <el-button
      text
      :disabled="isDisabled(item)"
      :bg="isActive(item)"
      @click="showLinkDialog"
      class="ept-toolbar-btn"
    >
      <template #icon>
        <icon :icon="item.icon"></icon>
      </template>
    </el-button>
  </el-tooltip>
  <insert-link-dialog width="500px" ref="insertLinkDialog" @ok="applyLink" />
</template>

<script>
import { inject } from 'vue'
import InsertLinkDialog from './InsertLinkDialog.vue'
import Icon from '../Icon.vue'

export default {
  setup() {
    const context = inject('context')
    const { editor, t, toolbar } = context
    const { isActive, isDisabled } = toolbar

    return { editor, t, isActive, isDisabled }
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    InsertLinkDialog,
    Icon,
  },
  methods: {
    insertLink(url, title) {
      this.command('link', {
        title,
        url,
      })
    },
    showLinkDialog() {
      let title = ''
      let url = ''

      if (this.editor.isActive('link')) {
        this.editor.chain().focus().extendMarkRange('link').run()
        url = this.editor.getAttributes('link').href
      }
      title = this.editor.state.doc.textBetween(
        this.editor.state.selection.from,
        this.editor.state.selection.to,
      )

      this.$refs.insertLinkDialog.open({
        title,
        url,
      })
    },
    hideLinkDialog() {
      this.$refs.insertLinkDialog.hide()
    },
    applyLink({ title, url }) {
      this.hideLinkDialog()

      const selectionTitle = this.editor.state.doc.textBetween(
        this.editor.state.selection.from,
        this.editor.state.selection.to,
      )
      if (title !== selectionTitle) {
        const mark = this.editor.schema.marks.link.create({ href: url, target: '_blank' })
        const from = this.editor.state.selection.from
        const transaction = this.editor.state.tr.deleteSelection()
        transaction.insertText(title)
        transaction.addMark(from, from + title.length, mark)
        this.editor.view.dispatch(transaction)
      } else {
        this.editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
      }
    },
  },
}
</script>
