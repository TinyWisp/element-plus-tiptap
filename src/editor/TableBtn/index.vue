<template>
  <el-popover placement="bottom" trigger="hover" width="auto">
    <template #reference>
      <el-button text>
        <template #icon>
          <icon :icon="item.icon" />
        </template>
      </el-button>
    </template>

    <insert-table-board @ok="insertTable($event.row, $event.col)" />
  </el-popover>
</template>

<script>
import InsertTableBoard from './InsertTableBoard.vue'
import Icon from '../Icon.vue'

export default {
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
  inject: ['t', 'insertTable'],
}
</script>
