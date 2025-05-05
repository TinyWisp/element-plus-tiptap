<template>
  <el-dropdown @command="handleDropdownMenuCommand">
    <el-button text class="btn">
      <template #icon>
        <mdi-js-icon :path="mdiImage"></mdi-js-icon>
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
    :style="{display: 'none'}"
  />


</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import type { PropType } from 'vue'
import type { FnUpload } from './types'
import type { Context } from '@smooth-markdown/core'
import InsertNetworkImageDialog from './InsertNetworkImageDialog.vue'
import MdiJsIcon from '../MdiJsIcon.vue'
import { mdiImage } from '@mdi/js'

export default defineComponent({
  setup() {
    const getContext = inject<() => Context>('getContext')
    const context = (getContext!)()
    const { t } = context.lang!
    const { command } = context.editor

    return { command, t }
  },
  components: {
    InsertNetworkImageDialog,
    MdiJsIcon
  },
  props: {
    fnUploadImage: {
      type: Function as PropType<FnUpload>,
      required: false,
    }
  },
  data() {
    return {
      mdiImage
    }
  },
  methods: {
    handleDropdownMenuCommand(cmd: string) {
      if (cmd === 'insertNetworkImage') {
        this.showNetworkImageDialog();
      } else {
        this.showUploadDialog();
      }
    },
    showNetworkImageDialog () {
      console.log(this.$refs)
      this.$refs.networkImageDialog.open()
    },
    insertNetworkImage (url: string, title: string) {
      this.command('image', {
        url,
        title,
      })
    },
    showUploadDialog () {
      const input = this.$refs.file as HTMLElement
      input.focus()
      input.click()
    },
    async uploadLocalImage () {
      const input = this.$refs.file as HTMLInputElement
      if (input.files?.length) {
        let url = window.URL.createObjectURL(input.files[0])
        if (this.fnUploadImage) {
          url = await this.fnUploadImage(input.files[0])
        }
        this.command('image', {
          title: '',
          url
        })
      }
    }
  }
})

</script>

<style scoped>
.btn {
  outline: none !important;
}
</style>