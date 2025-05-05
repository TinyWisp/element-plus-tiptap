<template>
  <el-dialog
    v-model="isVisible"
    :title="t('insertNetworkImageDialog.title')"
    max-width="600px">
    <el-form
      :model="form"
      :rules="rules"
      label-width="auto"
      ref="form"
    >
      <el-form-item :label="t('insertNetworkImageDialog.urlField')" prop="url">
        <el-input v-model="form.url" :placeholder="t('insertNetworkImageDialog.urlFieldPlaceHolder')"></el-input>
      </el-form-item>
      <el-form-item :label="t('insertNetworkImageDialog.titleField')" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="hide()"> {{ t('insertNetworkImageDialog.cancel') }} </el-button>
      <el-button type="primary" @click="ok()"> {{ t('insertNetworkImageDialog.ok') }} </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import type { Context } from '@smooth-markdown/core'

export default defineComponent({
  setup() {
    const getContext = inject<() => Context>('getContext')
    const context = (getContext!)()
    const { t } = context.lang

    return { t }
  },
  data() {
    return {
      isVisible: false,
      form: {
        url: '',
        title: ''
      },
      rules: {
        url: [
          {
            required: true,
            message: this.t('insertNetworkImageDialog.urlFieldIsEmptyErr'),
            trigger: 'blur'
          },
          {
            pattern: /^(http|https):\/\/.+$/,
            message: this.t('insertNetworkImageDialog.urlFieldIsInvalidErr'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    hide() {
      this.isVisible = false
    },
    open() {
      this.form.url = ''
      this.form.title = ''
      this.isVisible = true
    },
    ok () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', this.form.url, this.form.title)
          this.hide()
        }
      })
    }
  }
})
</script>