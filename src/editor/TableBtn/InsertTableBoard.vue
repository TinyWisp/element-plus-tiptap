<template>
  <div>
    {{
      curRow > 0
        ? t('insertTableBoard.info', { row: curRow.toString(), col: curCol.toString() })
        : t('insertTableBoard.title')
    }}
    <table class="table" ref="table">
      <tr v-for="row in rowNum" :key="row">
        <td
          v-for="col in colNum"
          :key="col"
          :class="['cell', { highlight: row <= curRow && col <= curCol }]"
          @mouseover="setCurrentRowAndCol(row, col)"
          @click="ok()"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  inject: ['t'],
  data: function () {
    return {
      rowNum: 10,
      colNum: 10,
      minRowNum: 10,
      minColNum: 10,
      curRow: 0,
      curCol: 0,
      timer: 0,
    }
  },
  methods: {
    setCurrentRowAndCol(row, col) {
      this.curRow = row
      this.curCol = col

      if (this.rowNum > this.minRowNum && this.rowNum > row) {
        this.rowNum--
      }
      if (this.colNum > this.minColNum && this.colNum > col) {
        this.colNum--
      }

      if (this.rowNum <= row) {
        this.rowNum++
      }
      if (this.colNum <= col) {
        this.colNum++
      }
    },
    hide() {
      this.$emit('input', false)
    },
    cancel() {
      this.hide()
    },
    ok() {
      this.$emit('ok', {
        row: this.curRow,
        col: this.curCol,
      })
    },
    doNothing() {},
  },
  mounted() {
    this.timer = setInterval(() => {
      if (!this.$refs?.table?.matches?.(':hover') && this.curRow > 0) {
        this.setCurrentRowAndCol(0, 0)
      }
    }, 200)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
.table {
  border-spacing: 2px;
}
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid black !important;
}
.highlight {
  background-color: lightblue;
}
</style>
