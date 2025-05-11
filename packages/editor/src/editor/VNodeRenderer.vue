<script>
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes.length !== 1 ? h('div', {}, this.vnodes) : this.vnodes[0]
  },
})
</script>
