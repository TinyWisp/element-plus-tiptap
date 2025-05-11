<template>
  <mdi-js-icon v-if="computedIcon.type === 'path'" :path="computedIcon.path" />
  <v-node-renderer v-else-if="computedIcon.type === 'vnode'" :vnodes="[computedIcon.vnode]" />
</template>

<script setup>
import { computed, isVNode } from 'vue'
import MdiJsIcon from './MdiJsIcon.vue'
import VNodeRenderer from './VNodeRenderer.vue'

const props = defineProps({
  icon: {
    type: [String, Object, Function],
    required: true,
  },
})

const computedIcon = computed(() => {
  if (typeof props.icon === 'string') {
    return {
      type: 'path',
      path: props.icon,
    }
  } else if (isVNode(props.icon)) {
    return {
      type: 'vnode',
      vnode: props.icon,
    }
  } else if (typeof props.icon === 'function') {
    const rs = props.icon()
    if (typeof rs === 'string') {
      return {
        type: 'path',
        path: rs,
      }
    } else if (isVNode(rs)) {
      return {
        type: 'vnode',
        vnode: rs,
      }
    }
  }

  return {
    type: 'unknown',
  }
})
</script>
