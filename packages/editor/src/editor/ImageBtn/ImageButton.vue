<template>
  <el-dropdown @command="handleDropdownMenuCommand">
    <el-button text class="ept-toolbar-btn">
      <template #icon>
        <icon :icon="item.icon"></icon>
      </template>
    </el-button>

    <!-- menu -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="insertNetworkImage">
          {{ t('toolbar.insertNetworkImage') }}
        </el-dropdown-item>
        <el-dropdown-item command="uploadLocalImage">
          {{ t('toolbar.uploadLocalImage') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- the network image dialog -->
  <insert-network-image-dialog
    ref="networkImageDialog"
    @ok="insertNetworkImage"
  ></insert-network-image-dialog>

  <!-- the upload image dialog -->
  <input
    type="file"
    ref="file"
    @change="uploadLocalImage()"
    accept="image/*"
    :style="{ display: 'none' }"
  />
</template>

<script>
import { inject } from 'vue'
import InsertNetworkImageDialog from './InsertNetworkImageDialog.vue'
import Icon from '../Icon.vue'
import { mdiImage } from '@mdi/js'

export default {
  setup() {
    const context = inject('context')
    const { editor, t, props } = context
    const { fnUploadImage } = props

    return { editor, t, fnUploadImage }
  },
  components: {
    InsertNetworkImageDialog,
    Icon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mdiImage,
    }
  },
  methods: {
    handleDropdownMenuCommand(cmd) {
      if (cmd === 'insertNetworkImage') {
        this.showNetworkImageDialog()
      } else {
        this.showUploadDialog()
      }
    },
    showNetworkImageDialog() {
      console.log(this.$refs)
      this.$refs.networkImageDialog.open()
    },
    insertNetworkImage({ url, title }) {
      this.editor.chain().focus().setImage({ src: url, title }).run()
    },
    showUploadDialog() {
      const input = this.$refs.file
      input.focus()
      input.click()
    },
    async uploadLocalImage() {
      const input = this.$refs.file
      if (input.files?.length) {
        let url = window.URL.createObjectURL(input.files[0])
        if (this.fnUploadImage) {
          url = await this.fnUploadImage(input.files[0])
        }
        this.insertNetworkImage({
          url,
          title: '',
        })
      }
    },
  },
}
</script>

<style scoped>
.ept-toolbar-btn {
  outline: none !important;
}
</style>
