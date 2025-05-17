<template>
  <el-popover placement="bottom" trigger="hover" width="auto">
    <template #reference>
      <el-button text :disabled="isDisabled(item)" :bg="isActive(item)">
        <template #icon>
          <icon :icon="item.icon" />
        </template>
      </el-button>
    </template>

    <insert-table-board :t="t" @ok="insertTable" />
  </el-popover>
</template>

<script>
import { inject } from 'vue'
import InsertTableBoard from './InsertTableBoard.vue'
import Icon from '../Icon.vue'

export default {
  setup() {
    const context = inject('context')
    const { editor, t, toolbar } = context
    const { isActive, isDisabled } = toolbar

    return { editor, t, isActive, isDisabled }
  },
  components: {
    InsertTableBoard,
    Icon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    insertTable({ row, col }) {
      this.editor
        .chain()
        .focus()
        .insertTable({
          rows: row,
          cols: col,
          withHeaderRow: true,
        })
        .run()
    },
  },
}
</script>
