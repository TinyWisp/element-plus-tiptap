<template>
  <el-dialog v-model="isVisible" :title="t('insertNetworkImageDialog.title')" width="500px">
    <el-form :model="form" :rules="rules" label-width="auto" ref="form">
      <el-form-item :label="t('insertNetworkImageDialog.field.url.label')" prop="url">
        <el-input
          v-model="form.url"
          :placeholder="t('insertNetworkImageDialog.field.url.placeholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('insertNetworkImageDialog.field.title.label')" prop="title">
        <el-input
          v-model="form.title"
          :placeholder="t('insertNetworkImageDialog.field.title.placeholder')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="hide()"> {{ t('insertNetworkImageDialog.cancel') }} </el-button>
      <el-button type="primary" @click="ok()"> {{ t('insertNetworkImageDialog.ok') }} </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { inject } from 'vue'

export default {
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
            message: this.t('insertNetworkImageDialog.field.url.emptyErr'),
            trigger: 'blur',
          },
          {
            pattern: /^(http|https):\/\/.+$/,
            message: this.t('insertNetworkImageDialog.field.url.invalidErr'),
            trigger: 'change',
          },
        ],
      },
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
    ok() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', {
            url: this.form.url,
            title: this.form.title,
          })
          this.hide()
        }
      })
    },
  },
}
</script>
