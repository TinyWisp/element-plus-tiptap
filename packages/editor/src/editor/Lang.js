import get from 'lodash/get'
import merge from 'lodash/merge'
import { ref, reactive } from 'vue'

export default class Lang {
  messageMap = {}
  locale = ref('')
  fallbackLocale = ref('')

  constructor() {
    this.messageMap = reactive({})
    this.locale = ref('en')
    this.fallbackLocale = ref('en')
    this.merge = this.merge.bind(this)
    this.t = this.t.bind(this)
    this.print = this.print.bind(this)
  }

  merge(messageMap) {
    this.messageMap = merge(this.messageMap, messageMap)
  }

  /**
   *
   * @param path
   * @param varMap
   * @returns
   */
  t(path, varMap = {}) {
    let msg = get(this.messageMap, `${this.locale.value}.${path}`)

    if (typeof msg !== 'string') {
      msg = get(this.messageMap, `${this.fallbackLocale.value}.${path}`)
    }

    if (typeof msg !== 'string') {
      return path
    }

    for (const key in varMap) {
      const pattern = new RegExp(`{${key}}`, 'g')
      msg = msg.replace(pattern, varMap[key])
    }

    return msg
  }

  setLocale(locale) {
    this.locale.value = locale
  }

  setFallbackLocale(fallbackLocale) {
    this.fallbackLocale.value = fallbackLocale
  }

  print() {
    console.log(this.messageMap)
  }
}
