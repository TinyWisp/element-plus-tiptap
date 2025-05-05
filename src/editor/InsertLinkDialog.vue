<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('input', $event)"
    :title="t('insertLinkDialog.title')"
    width="600px"
  >
    <el-form label-width="80px">
      <el-form-item :label="t('insertLinkDialog.titleFieldPlaceHolder')">
        <el-input
          :model-value="title"
          @update:model-value="$emit('update:title', $event)"
          clearable
          required
        />
      </el-form-item>
      <el-form-item label="URL">
        <el-input
          :model-value="url"
          @update:model-value="$emit('update:url', $event)"
          placeholder="https://"
          clearable
          required
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel()">{{ t('insertLinkDialog.cancel') }}</el-button>
      <el-button type="primary" @click="ok()">{{ t('insertLinkDialog.ok') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    url: {
      type: String,
      required: false,
      default: '',
    },
  },
  inject: ['t'],
  data: function () {
    return {
      mdiClose,
    }
  },
  methods: {
    hide() {
      this.$emit('update:modelValue', false)
    },
    cancel() {
      this.hide()
    },
    ok() {
      this.$emit('ok')
    },
  },
}
</script>
