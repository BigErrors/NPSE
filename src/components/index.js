import goTop from '@/components/goTop'
import wordCloud from '@/components/WordCloud'

export default {
  install: function (vue) {
    vue.component('goTop', goTop)
    vue.component('wordCloud', wordCloud)
  }
}
