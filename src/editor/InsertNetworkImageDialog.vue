<template>
  <el-dialog
    :model-value="modelValue"
    @close="hide"
    width="600px"
    :title="t('insertNetworkImageDialog.title')"
  >
    <div class="dialog-body">
      <el-form>
        <el-form-item>
          <el-input
            :model-value="url"
            @update:modelValue="$emit('update:url', $event)"
            placeholder="https://"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="hide">{{ t('insertNetworkImageDialog.cancel') }}</el-button>
      <el-button type="primary" @click="ok">{{ t('insertNetworkImageDialog.ok') }}</el-button>
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
    url: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: function () {
    return {
      mdiClose,
    }
  },
  inject: ['t'],
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
