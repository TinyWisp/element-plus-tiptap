<template>
  <el-dialog v-model="isVisible" :title="t('insertLinkDialog.title')" max-width="600px">
    <el-form :model="form" :rules="rules" label-width="auto" ref="form">
      <el-form-item :label="t('insertLinkDialog.field.url.label')" prop="url">
        <el-input
          v-model="form.url"
          :placeholder="t('insertLinkDialog.field.url.placeholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('insertLinkDialog.field.title.label')" prop="title">
        <el-input
          v-model="form.title"
          :placeholder="t('insertLinkDialog.field.title.placeholder')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="hide()"> {{ t('insertLinkDialog.cancel') }} </el-button>
      <el-button type="primary" @click="ok()"> {{ t('insertLinkDialog.ok') }} </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, inject } from 'vue'

export default defineComponent({
  setup() {
    const context = inject('context')
    const { t } = context

    return { t }
  },
  data() {
    return {
      isVisible: false,
      form: {
        url: '',
        title: '',
      },
      rules: {
        url: [
          {
            required: true,
            message: this.t('insertLinkDialog.field.url.emptyErr'),
            trigger: 'blur',
          },
          {
            pattern: /^(http|https):\/\/.+$/,
            message: this.t('insertLinkDialog.field.url.invalidErr'),
            trigger: 'change',
          },
        ],
        title: [
          {
            required: true,
            message: this.t('insertLinkDialog.field.title.emptyErr'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    hide() {
      this.isVisible = false
    },
    open({ url, title }) {
      this.form.url = url
      this.form.title = title
      this.isVisible = true
    },
    ok() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', {
            title: this.form.title,
            url: this.form.url,
          })
          this.hide()
        }
      })
    },
  },
})
</script>
