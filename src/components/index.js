import goTop from '@/components/goTop'
import wordCloud from '@/components/wordCloud'

export default {
  install: function (vue) {
    vue.component('goTop', goTop)
    vue.component('wordCloud', wordCloud)
  }
}
